import { reindexRag } from "../lib/rag-engine.ts";

const result = await reindexRag();

console.log(
  `RAG reindex complete: ${result.index}/${result.namespace}, ${result.indexedChunks} chunks`,
);
