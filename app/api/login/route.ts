import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

interface FirebaseSignInResponse {
  localId: string;
  email: string;
  displayName?: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; pw?: string };
    const email = body.id?.trim();
    const password = body.pw?.trim();

    if (!email || !password) {
      return NextResponse.json({ message: "아이디/비밀번호를 입력해주세요." }, { status: 400 });
    }

    const firebaseWebApiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!firebaseWebApiKey) {
      return NextResponse.json({ message: "FIREBASE_WEB_API_KEY is not configured." }, { status: 503 });
    }

    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseWebApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    if (!signInRes.ok) {
      return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const signInData = (await signInRes.json()) as FirebaseSignInResponse;

    const userDoc = await getFirebaseAdminDb().collection("users").doc(signInData.localId).get();
    const profile = userDoc.exists ? userDoc.data() : null;

    return NextResponse.json({
      ok: true,
      user: {
        uid: signInData.localId,
        email: signInData.email,
        name: profile?.name ?? signInData.displayName ?? "User",
        role: profile?.role ?? "user",
      },
      token: signInData.idToken,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ message: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
