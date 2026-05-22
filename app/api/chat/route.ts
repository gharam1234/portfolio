import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Gemini API key is not configured." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      message?: string;
      history?: ChatMessage[];
    };

    if (!body.message?.trim()) {
      return NextResponse.json(
        { message: "Message is required." },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are the AI assistant for a professional Web & AI Engineer's portfolio.
        Your name is "Synthetix AI".
        Be professional, technical, and precise.
        You know about the engineer's skills: React, TypeScript, Node.js, Python, TensorFlow, and LLM orchestration.
        The engineer values performance, clean code, and user experience.
        If asked about projects, mention "Project X-1", "Neural Dashboard", and "Astra Forge".
        Respond in Markdown format. Keep responses concise but helpful.`,
      },
      history: body.history ?? [],
    });

    const response = await chat.sendMessage({ message: body.message });

    return NextResponse.json({
      message: response.text || "I'm sorry, I couldn't process that.",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      { message: "The logical system is currently offline. Please check back later." },
      { status: 500 },
    );
  }
}
