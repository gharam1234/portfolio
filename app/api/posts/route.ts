import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

interface FirestorePost {
  author?: string;
  content?: string;
  createdAt?: Timestamp;
  role?: string;
}

function serializePost(id: string, post: FirestorePost) {
  const createdAt = post.createdAt?.toDate();

  return {
    id,
    author: post.author ?? "VISITOR",
    content: post.content ?? "",
    role: post.role ?? "VISITOR",
    timestamp: createdAt ? createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const snapshot = await getFirebaseAdminDb()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    return NextResponse.json({
      posts: snapshot.docs.map((doc) =>
        serializePost(doc.id, doc.data() as FirestorePost),
      ),
    });
  } catch (error) {
    console.error("Firestore posts GET error:", error);

    return NextResponse.json(
      { message: "Unable to load posts." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      author?: string;
      content?: string;
    };

    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { message: "Content is required." },
        { status: 400 },
      );
    }

    const doc = await getFirebaseAdminDb().collection("posts").add({
      author: body.author?.trim() || "VISITOR",
      content,
      role: "VISITOR",
      createdAt: FieldValue.serverTimestamp(),
    });

    const saved = await doc.get();

    return NextResponse.json(
      { post: serializePost(saved.id, saved.data() as FirestorePost) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Firestore posts POST error:", error);

    return NextResponse.json(
      { message: "Unable to create post." },
      { status: 503 },
    );
  }
}
