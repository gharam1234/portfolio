import fs from "node:fs/promises";
import path from "node:path";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const DATA_DIR = path.join(process.cwd(), "rag-data");
const PINECONE_INDEX = process.env.PINECONE_INDEX ?? "synthetix-portfolio";
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE ?? "default";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "text-embedding-004";

interface RagDocument {
  pageContent: string;
  metadata: Record<string, string>;
}

let cachedChunks: RagDocument[] | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  return new GoogleGenAI({ apiKey });
}

function getPineconeIndex() {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error("PINECONE_API_KEY is required");
  }

  const pinecone = new Pinecone({ apiKey });
  return pinecone.index(PINECONE_INDEX).namespace(PINECONE_NAMESPACE);
}

async function embedText(text: string) {
  const ai = getGeminiClient();
  const response = await ai.models.embedContent({
    model: GEMINI_EMBED_MODEL,
    contents: text,
  });

  const vector = response.embeddings?.[0]?.values;
  if (!vector?.length) {
    throw new Error("Failed to create embedding from Gemini");
  }

  return vector;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      const message = (error as Error)?.message ?? "";
      const isQuota = message.includes("429") || message.includes("RESOURCE_EXHAUSTED");
      if (!isQuota || attempt >= retries) throw error;
      const waitMs = 1000 * Math.pow(2, attempt);
      await sleep(waitMs);
      attempt += 1;
    }
  }
}

async function embedTexts(texts: string[]) {
  const ai = getGeminiClient();
  const vectors: number[][] = [];
  const batchSize = 20;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const response = await withRetry(() =>
      ai.models.embedContent({
        model: GEMINI_EMBED_MODEL,
        contents: batch,
      }),
    );

    const batchVectors = response.embeddings?.map((item) => item.values ?? []).filter((v) => v.length > 0) ?? [];
    if (batchVectors.length !== batch.length) {
      throw new Error("Gemini embedding batch response size mismatch");
    }

    vectors.push(...batchVectors);
    await sleep(250);
  }

  return vectors;
}

async function loadJsonDocs() {
  const jsonPath = path.join(DATA_DIR, "knowledge.json");
  const raw = await fs.readFile(jsonPath, "utf-8");
  const parsed = JSON.parse(raw) as Array<{ id?: string; text?: string }>;
  return parsed
    .filter((x) => x.text?.trim())
    .map((x, i) => ({
      pageContent: x.text!.trim(),
      metadata: { source: "json", id: x.id ?? `json-${i + 1}` },
    }));
}

async function loadDocumentDocs() {
  const docs: RagDocument[] = [];

  const txtPath = path.join(DATA_DIR, "pdf-extract.txt");
  const raw = await fs.readFile(txtPath, "utf-8");
  docs.push({
    pageContent: raw,
    metadata: { source: "pdf-text", file: "pdf-extract.txt" },
  });

  const documentsDir = path.join(DATA_DIR, "documents");
  try {
    const entries = await fs.readdir(documentsDir, { withFileTypes: true });
    const markdownFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort();

    for (const file of markdownFiles) {
      const filePath = path.join(documentsDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      if (!content.trim()) continue;

      docs.push({
        pageContent: content,
        metadata: { source: "project-doc", file },
      });
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  return docs;
}

async function loadChunks() {
  if (cachedChunks) return cachedChunks;

  const docs = [...(await loadJsonDocs()), ...(await loadDocumentDocs())];
  const chunkSize = 700;
  const chunkOverlap = 100;
  cachedChunks = docs.flatMap((doc) => {
    const chunks: RagDocument[] = [];
    for (let start = 0, index = 0; start < doc.pageContent.length; index += 1) {
      const end = Math.min(doc.pageContent.length, start + chunkSize);
      chunks.push({
        pageContent: doc.pageContent.slice(start, end),
        metadata: { ...doc.metadata, chunk: String(index) },
      });
      if (end === doc.pageContent.length) break;
      start = Math.max(start + 1, end - chunkOverlap);
    }
    return chunks;
  });
  return cachedChunks;
}

async function indexRagDocuments() {
  const chunks = await loadChunks();
  const vectors = await embedTexts(chunks.map((chunk) => chunk.pageContent));
  const index = getPineconeIndex();

  await index.upsert(
    chunks.map((chunk, i) => ({
      id: `${String(chunk.metadata.id ?? chunk.metadata.file ?? chunk.metadata.source ?? "doc")}-${String(chunk.metadata.chunk ?? i)}`,
      values: vectors[i],
      metadata: {
        source: String(chunk.metadata.source ?? "unknown"),
        refId: String(chunk.metadata.id ?? chunk.metadata.file ?? "unknown"),
        text: chunk.pageContent,
      },
    })),
  );

  return chunks.length;
}

export async function reindexRag() {
  cachedChunks = null;
  const indexedChunks = await indexRagDocuments();

  return {
    index: PINECONE_INDEX,
    namespace: PINECONE_NAMESPACE,
    indexedChunks,
  };
}

export interface ChatHistoryItem {
  role?: string;
  parts?: Array<{ text?: string }>;
}

function getHistoryText(history: ChatHistoryItem[] = []) {
  return history
    .slice(-6)
    .map((item) => {
      const text = item.parts?.map((part) => part.text ?? "").join(" ").trim();
      return text ? `${item.role ?? "unknown"}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function buildSearchQuery(question: string, history: ChatHistoryItem[] = []) {
  const historyText = getHistoryText(history);
  return `${historyText}\n${question}`.trim();
}

export async function askRag(question: string, history: ChatHistoryItem[] = []) {
  const historyText = getHistoryText(history);
  const queryEmbedding = await embedText(buildSearchQuery(question, history));
  const index = getPineconeIndex();
  const result = await index.query({
    vector: queryEmbedding,
    topK: 12,
    includeMetadata: true,
  });

  const contexts = (result.matches ?? [])
    .map((match) => ({
      source: String(match.metadata?.source ?? "unknown"),
      refId: String(match.metadata?.refId ?? "unknown"),
      pageContent: String(match.metadata?.text ?? ""),
    }))
    .filter((item) => item.pageContent.trim().length > 0);

  if (contexts.length === 0) {
    return {
      answer:
        "아직 RAG 인덱스 데이터가 없거나 검색 결과가 없습니다. 먼저 관리자 Reindex를 1회 실행해 주세요.",
      contexts: [],
      model: GEMINI_MODEL,
      index: PINECONE_INDEX,
      namespace: PINECONE_NAMESPACE,
    };
  }

  const contextText = contexts
    .map((d, i) => `${i + 1}. [${d.source}] ${d.pageContent}`)
    .join("\n\n");

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    config: {
      systemInstruction:
        "You are a portfolio RAG assistant. Answer in the same language as the user's latest question. Use the given context and conversation history first. Return ONLY the final answer for the user. Do NOT repeat the question. Do NOT quote or dump full retrieved context. If the latest question is a follow-up, resolve references using conversation history. If context is insufficient, explicitly say what is missing.",
      temperature: 0.2,
    },
    contents: `Conversation history:\n${historyText || "(no previous conversation)"}\n\nQuestion:\n${question}\n\nRetrieved context for internal use only. Do not repeat it verbatim:\n${contextText || "(no context found)"}`,
  });

  const answer = response.text?.trim() || "답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";

  return {
    answer,
    contexts: contexts.map((d) => ({
      source: d.source,
      refId: d.refId,
      preview: d.pageContent.slice(0, 220),
    })),
    model: GEMINI_MODEL,
    index: PINECONE_INDEX,
    namespace: PINECONE_NAMESPACE,
  };
}
