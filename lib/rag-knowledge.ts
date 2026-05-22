import fs from "node:fs/promises";
import path from "node:path";

export interface KnowledgeDoc {
  id: string;
  source: "json" | "pdf";
  text: string;
}

const DATA_DIR = path.join(process.cwd(), "rag-data");

async function readJsonDocs(): Promise<KnowledgeDoc[]> {
  const jsonPath = path.join(DATA_DIR, "knowledge.json");

  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw) as Array<{ id?: string; text?: string }>;
    return parsed
      .filter((d) => d.text?.trim())
      .map((d, idx) => ({
        id: d.id ?? `json-${idx + 1}`,
        source: "json" as const,
        text: d.text!.trim(),
      }));
  } catch {
    return [];
  }
}

async function readPdfExtractDocs(): Promise<KnowledgeDoc[]> {
  const txtPath = path.join(DATA_DIR, "pdf-extract.txt");

  try {
    const raw = await fs.readFile(txtPath, "utf-8");
    const chunks = raw
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return chunks.map((text, idx) => ({
      id: `pdf-${idx + 1}`,
      source: "pdf" as const,
      text,
    }));
  } catch {
    return [];
  }
}

function scoreDoc(question: string, text: string) {
  const q = question.toLowerCase();
  const t = text.toLowerCase();
  const terms = q.split(/\s+/).filter((w) => w.length > 1);
  return terms.reduce((acc, w) => (t.includes(w) ? acc + 1 : acc), 0);
}

export async function retrieveContext(question: string, topK = 4) {
  const all = [...(await readJsonDocs()), ...(await readPdfExtractDocs())];

  return all
    .map((doc) => ({ doc, score: scoreDoc(question, doc.text) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.doc);
}
