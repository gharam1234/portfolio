import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Post id is required." },
        { status: 400 },
      );
    }

    await getFirebaseAdminDb().collection("posts").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Firestore posts DELETE error:", error);

    return NextResponse.json(
      { message: "Unable to delete post." },
      { status: 503 },
    );
  }
}
