import { NextResponse } from "next/server";
import { askRag, type ChatHistoryItem } from "@/lib/rag-langchain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; history?: ChatHistoryItem[] };
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ message: "question is required" }, { status: 400 });
    }

    const result = await askRag(question, body.history ?? []);
    return NextResponse.json(result);
  } catch (error) {
    console.error("RAG route error:", error);
    return NextResponse.json(
      {
        message: "RAG 처리 중 오류가 발생했습니다.",
        hint: "Check GEMINI_API_KEY and Pinecone env vars(PINECONE_API_KEY/PINECONE_INDEX) are configured.",
      },
      { status: 500 },
    );
  }
}
