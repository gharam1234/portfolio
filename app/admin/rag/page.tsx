"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";

interface KnowledgeItem {
  id: string;
  text: string;
}

interface RagContextPayload {
  knowledge: KnowledgeItem[];
  pdfText: string;
}

const emptyItem = (): KnowledgeItem => ({ id: `context-${Date.now()}`, text: "" });

export default function RagAdminPage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [pdfText, setPdfText] = useState("");
  const [status, setStatus] = useState("Loading context...");
  const [isBusy, setIsBusy] = useState(false);

  const adminFetch = (url: string, init: RequestInit = {}) => {
    const token = sessionStorage.getItem("synthetix-id-token") ?? "";
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...init, headers });
  };

  const loadContext = async () => {
    setIsBusy(true);
    setStatus("Loading context...");
    try {
      const response = await adminFetch("/api/admin/rag-context", { cache: "no-store" });
      if (!response.ok) throw new Error(await response.text());
      const data = (await response.json()) as RagContextPayload;
      setKnowledge(data.knowledge);
      setPdfText(data.pdfText);
      setStatus(`Loaded ${data.knowledge.length} JSON context items.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load context.");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("synthetix-id-token")) {
      window.location.href = "/login";
      return;
    }
    void loadContext();
  }, []);

  const updateItem = (index: number, patch: Partial<KnowledgeItem>) => {
    setKnowledge((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const saveContext = async () => {
    setIsBusy(true);
    setStatus("Saving context...");
    try {
      const response = await adminFetch("/api/admin/rag-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledge, pdfText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Failed to save context.");
      setKnowledge(data.knowledge);
      setPdfText(data.pdfText);
      setStatus(`Saved ${data.knowledge.length} items. Click Reindex to update Pinecone.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save context.");
    } finally {
      setIsBusy(false);
    }
  };

  const reindex = async () => {
    setIsBusy(true);
    setStatus("Reindexing with Gemini + Pinecone...");
    try {
      const response = await adminFetch("/api/admin/rag-context/reindex", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Failed to reindex context.");
      setStatus(`Reindexed ${data.indexedChunks} chunks into ${data.index}/${data.namespace}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to reindex context.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-deep text-on-surface px-6 py-10 font-sans">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3 border-b border-border-subtle pb-6">
          <a href="/" className="text-xs font-mono text-primary hover:underline">
            ← Back to portfolio
          </a>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">/_RAG_CONTEXT_ADMIN</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Context Editor</h1>
              <p className="mt-3 max-w-2xl text-on-surface-muted">
                Edit the facts and long-form document context used by the portfolio RAG assistant. Save writes
                to <code className="text-primary">rag-data/</code>; Reindex pushes the latest content into Pinecone.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadContext}
                disabled={isBusy}
                className="flex items-center gap-2 rounded border border-border-subtle px-4 py-3 text-sm font-bold uppercase hover:border-primary disabled:opacity-50"
              >
                <RefreshCw size={16} /> Reload
              </button>
              <button
                onClick={saveContext}
                disabled={isBusy}
                className="flex items-center gap-2 rounded bg-primary px-4 py-3 text-sm font-bold uppercase text-surface-deep disabled:opacity-50"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={reindex}
                disabled={isBusy}
                className="flex items-center gap-2 rounded bg-secondary px-4 py-3 text-sm font-bold uppercase text-surface-deep disabled:opacity-50"
              >
                <RefreshCw size={16} /> Reindex
              </button>
            </div>
          </div>
          <div className="rounded border border-border-subtle bg-surface-container p-3 font-mono text-xs text-on-surface-muted">
            {status}
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">JSON knowledge</h2>
            <button
              onClick={() => setKnowledge((items) => [...items, emptyItem()])}
              className="flex items-center gap-2 rounded border border-primary px-3 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-surface-deep"
            >
              <Plus size={16} /> Add item
            </button>
          </div>

          <div className="grid gap-4">
            {knowledge.map((item, index) => (
              <article key={`${item.id}-${index}`} className="rounded-xl border border-border-subtle bg-surface-container p-4">
                <div className="mb-3 flex gap-3">
                  <input
                    value={item.id}
                    onChange={(event) => updateItem(index, { id: event.target.value })}
                    placeholder="context-id"
                    className="flex-1 rounded border border-border-subtle bg-surface-deep px-3 py-2 font-mono text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => setKnowledge((items) => items.filter((_, i) => i !== index))}
                    className="rounded border border-red-500/40 px-3 text-red-300 hover:bg-red-500/10"
                    aria-label={`Delete ${item.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  value={item.text}
                  onChange={(event) => updateItem(index, { text: event.target.value })}
                  placeholder="Write a clear fact or feature description the chatbot should know."
                  rows={4}
                  className="w-full rounded border border-border-subtle bg-surface-deep px-3 py-2 text-sm leading-6 outline-none focus:border-primary"
                />
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Long document context</h2>
          <textarea
            value={pdfText}
            onChange={(event) => setPdfText(event.target.value)}
            rows={16}
            className="w-full rounded-xl border border-border-subtle bg-surface-container p-4 font-mono text-sm leading-6 outline-none focus:border-primary"
          />
        </section>
      </div>
    </main>
  );
}
