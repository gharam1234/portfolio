import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getFirebaseAdminApp() {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are not configured.");
  }

  return (
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  );
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export type AdminAccess =
  | { ok: true; uid: string }
  | { ok: false; status: 401 | 403; message: string };

export async function verifyAdminRequest(request: Request): Promise<AdminAccess> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) {
    return { ok: false, status: 401, message: "관리자 로그인이 필요합니다." };
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    const profile = await getFirebaseAdminDb().collection("users").doc(decoded.uid).get();
    if (profile.data()?.role !== "admin") {
      return { ok: false, status: 403, message: "관리자 권한이 필요합니다." };
    }
    return { ok: true, uid: decoded.uid };
  } catch {
    return { ok: false, status: 401, message: "로그인이 만료되었습니다. 다시 로그인해 주세요." };
  }
}
