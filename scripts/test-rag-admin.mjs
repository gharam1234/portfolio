import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const { readRagContext, writeRagContext } = await import("../lib/rag-admin.ts");

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "rag-admin-test-"));
const dataDir = path.join(tmp, "rag-data");
await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(
  path.join(dataDir, "knowledge.json"),
  JSON.stringify([{ id: "one", text: "First context" }], null, 2),
);
await fs.writeFile(path.join(dataDir, "pdf-extract.txt"), "Long document context");

const before = await readRagContext(dataDir);
assert.deepEqual(before.knowledge, [{ id: "one", text: "First context" }]);
assert.equal(before.pdfText, "Long document context");

await writeRagContext(dataDir, {
  knowledge: [
    { id: "two", text: "Second context" },
    { id: "trimmed", text: "  Trim me  " },
  ],
  pdfText: "Updated document",
});

const after = await readRagContext(dataDir);
assert.deepEqual(after.knowledge, [
  { id: "two", text: "Second context" },
  { id: "trimmed", text: "Trim me" },
]);
assert.equal(after.pdfText, "Updated document");

await assert.rejects(
  () => writeRagContext(dataDir, { knowledge: [{ id: "", text: "no id" }], pdfText: "x" }),
  /id is required/,
);
await assert.rejects(
  () => writeRagContext(dataDir, { knowledge: [{ id: "x", text: "" }], pdfText: "x" }),
  /text is required/,
);

console.log("rag admin tests passed");
