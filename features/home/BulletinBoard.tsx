"use client";

import { motion } from "motion/react";
import { Clock, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  role: string;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "방금 전";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

export default function BulletinBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts", { cache: "no-store" });
        const data = (await response.json()) as { posts?: Post[]; message?: string };

        if (!response.ok) throw new Error(data.message || "게시글을 불러오지 못했습니다.");
        if (isMounted) setPosts(data.posts ?? []);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddPost = async () => {
    const content = newPost.trim();
    if (!content || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await response.json()) as { post?: Post; message?: string };

      if (!response.ok || !data.post) throw new Error(data.message || "게시글을 작성하지 못했습니다.");

      setPosts((current) => [data.post!, ...current]);
      setNewPost("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글을 작성하지 못했습니다.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(data.message || "게시글을 삭제하지 못했습니다.");

      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글을 삭제하지 못했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="activity" className="py-32 bg-surface-container/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-sans font-bold mb-4">활동 로그</h2>
          <p className="text-text-muted">프로젝트 진행 메모와 피드백을 기록하는 공간입니다.</p>
        </div>

        <div className="glass rounded-xl overflow-hidden border border-border-subtle">
          <div className="p-6 bg-surface-deep/40 border-b border-border-subtle">
            <div className="flex gap-4">
              <input
                type="text"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  handleAddPost();
                }}
                disabled={isSubmitting}
                placeholder="생각이나 진행 상황을 기록해보세요..."
                className="flex-1 bg-surface-container border border-border-subtle rounded px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
              <button onClick={handleAddPost} disabled={!newPost.trim() || isSubmitting} className="px-6 py-2 bg-primary text-surface-deep font-bold rounded flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Plus size={18} /> {isSubmitting ? "저장 중" : "작성"}
              </button>
            </div>
            {error && <p className="mt-3 text-xs font-mono text-secondary">{error}</p>}
          </div>

          <div className="grid gap-3 p-4">
            {isLoading && <div className="p-6 text-center text-sm text-text-muted">활동 로그를 불러오는 중...</div>}

            {!isLoading && posts.length === 0 && <div className="p-6 text-center text-sm text-text-muted">아직 작성된 활동 로그가 없습니다.</div>}

            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bento-card group bg-surface-deep/20 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary uppercase">{post.role}</span>
                    <span className="font-bold text-sm">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted text-[10px] font-mono">
                    <Clock size={12} /> {formatTimestamp(post.timestamp)}
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{post.content}</p>
                <div className="mt-2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-primary">
                    <MessageSquare size={12} /> 답글
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} disabled={deletingId === post.id} className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-secondary disabled:opacity-50">
                    <Trash2 size={12} /> {deletingId === post.id ? "삭제 중" : "삭제"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
