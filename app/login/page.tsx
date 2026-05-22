"use client";

import { useState } from "react";

interface LoginResult {
  ok?: boolean;
  user?: { name?: string; email?: string; role?: string };
  message?: string;
}

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWelcome("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pw }),
      });

      const data = (await res.json()) as LoginResult;

      if (!res.ok || !data.ok) {
        setError(data.message ?? "로그인에 실패했어요.");
        return;
      }

      setWelcome(`${data.user?.name ?? "User"}님 로그인 성공! (${data.user?.role ?? "user"})`);
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-sm text-white/70">id(email)와 비밀번호로 로그인하세요.</p>

        <label className="block space-y-1">
          <span className="text-sm">아이디 (이메일)</span>
          <input
            type="email"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded bg-black/30 border border-white/20 px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm">비밀번호</span>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded bg-black/30 border border-white/20 px-3 py-2"
            placeholder="••••••••"
            required
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded bg-cyan-400 text-black font-semibold py-2 disabled:opacity-60"
          type="submit"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {error && <p className="text-red-300 text-sm">{error}</p>}
        {welcome && <p className="text-green-300 text-sm">{welcome}</p>}
      </form>
    </main>
  );
}
