import { NextResponse } from "next/server";
import { readRagContext, writeRagContext, type RagContextPayload } from "@/lib/rag-admin";

export async function GET() {
  try {
    const context = await readRagContext();
    return NextResponse.json(context);
  } catch (error) {
    console.error("RAG context GET error:", error);
    return NextResponse.json({ message: "Failed to read RAG context." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as RagContextPayload;
    const context = await writeRagContext(undefined, payload);
    return NextResponse.json(context);
  } catch (error) {
    console.error("RAG context PUT error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to write RAG context." },
      { status: 400 },
    );
  }
}
