import fs from "node:fs/promises";
import path from "node:path";
import { reindexRag } from "./rag-engine";

export interface KnowledgeItem {
  id: string;
  text: string;
}

export interface RagContextPayload {
  knowledge: KnowledgeItem[];
  pdfText: string;
}

export const DEFAULT_RAG_DATA_DIR = path.join(process.cwd(), "rag-data");

function normalizeKnowledge(items: KnowledgeItem[]) {
  return items.map((item, index) => {
    const id = item.id?.trim();
    const text = item.text?.trim();

    if (!id) {
      throw new Error(`knowledge[${index}].id is required`);
    }

    if (!text) {
      throw new Error(`knowledge[${index}].text is required`);
    }

    return { id, text };
  });
}

export async function readRagContext(dataDir = DEFAULT_RAG_DATA_DIR): Promise<RagContextPayload> {
  const [knowledgeRaw, pdfText] = await Promise.all([
    fs.readFile(path.join(dataDir, "knowledge.json"), "utf-8"),
    fs.readFile(path.join(dataDir, "pdf-extract.txt"), "utf-8"),
  ]);

  const parsed = JSON.parse(knowledgeRaw) as KnowledgeItem[];
  return {
    knowledge: normalizeKnowledge(parsed),
    pdfText,
  };
}

export async function writeRagContext(
  dataDir = DEFAULT_RAG_DATA_DIR,
  payload: RagContextPayload,
): Promise<RagContextPayload> {
  const normalized = {
    knowledge: normalizeKnowledge(payload.knowledge ?? []),
    pdfText: payload.pdfText ?? "",
  };

  await fs.mkdir(dataDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(dataDir, "knowledge.json"), `${JSON.stringify(normalized.knowledge, null, 2)}\n`),
    fs.writeFile(path.join(dataDir, "pdf-extract.txt"), normalized.pdfText),
  ]);

  return normalized;
}

export async function reindexRagContext() {
  return reindexRag();
}
