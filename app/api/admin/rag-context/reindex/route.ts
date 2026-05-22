import { NextResponse } from "next/server";
import { reindexRagContext } from "@/lib/rag-admin";

export async function POST() {
  try {
    const result = await reindexRagContext();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("RAG reindex error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to reindex RAG context.",
        hint: "Check GEMINI_API_KEY and Pinecone env vars(PINECONE_API_KEY/PINECONE_INDEX) are configured.",
      },
      { status: 500 },
    );
  }
}
