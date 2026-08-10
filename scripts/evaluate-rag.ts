import fs from "node:fs/promises";
import path from "node:path";
import { askRag } from "../lib/rag-engine.ts";

interface EvaluationCase {
  question: string;
  expectedRefId: string;
}

const cases = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "rag-data/evaluation.json"), "utf-8"),
) as EvaluationCase[];

let passed = 0;
for (const item of cases) {
  const result = await askRag(item.question);
  const retrieved = result.contexts.map((context) => context.refId);
  const ok = retrieved.includes(item.expectedRefId);
  if (ok) passed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${item.question}`);
  if (!ok) console.log(`  expected=${item.expectedRefId} retrieved=${retrieved.join(",")}`);
}

console.log(`\nRetrieval evaluation: ${passed}/${cases.length}`);
if (passed !== cases.length) process.exitCode = 1;
