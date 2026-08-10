"use client";

import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, X, Minimize2, Maximize2, Circle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
  sources?: Array<{ source: string; refId: string; preview: string }>;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "안녕하세요! 포트폴리오, 프로젝트, 기술스택에 대해 무엇이든 물어보세요." },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (isTyping || !input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    try {
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage, history }),
      });
      const data = (await response.json()) as {
        answer?: string;
        message?: string;
        contexts?: Array<{ source?: string; refId?: string; preview?: string }>;
      };
      if (!response.ok) throw new Error(data.message || "답변을 생성하지 못했습니다.");

      const sources = (data.contexts ?? [])
        .filter((item) => item.source && item.preview)
        .slice(0, 3)
        .map((item) => ({ source: item.source!, refId: item.refId ?? "document", preview: item.preview! }));
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: data.answer || "관련 문서에서 답을 찾지 못했습니다.",
          sources,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: error instanceof Error
            ? `답변을 불러오지 못했습니다: ${error.message}`
            : "답변을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        id="chatbot-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-surface-deep rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
      >
        <Bot size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "64px" : "500px",
              width: "380px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 glass rounded-lg overflow-hidden z-[500] flex flex-col"
          >
            <div className="p-4 border-bottom border-border-subtle flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot size={20} className="text-primary" />
                  <Circle size={8} className="absolute -top-1 -right-1 text-tertiary fill-tertiary animate-pulse" />
                </div>
                <span className="font-sans font-semibold text-sm">Synthetix AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-secondary/20" : "bg-primary/20"}`}>
                          {m.role === "user" ? <User size={14} className="text-secondary" /> : <Bot size={14} className="text-primary" />}
                        </div>
                        <div className={`p-3 rounded-lg ${m.role === "user" ? "bg-primary text-surface-deep" : "bg-surface-elevated border border-border-subtle text-on-surface"}`}>
                          <div className="markdown-body prose prose-invert prose-sm">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                          {m.sources && m.sources.length > 0 && (
                            <details className="mt-3 border-t border-border-subtle pt-2 text-[10px] text-text-muted">
                              <summary className="cursor-pointer font-mono text-primary">사용한 문서 {m.sources.length}개</summary>
                              <ul className="mt-2 space-y-2">
                                {m.sources.map((source, sourceIndex) => (
                                  <li key={`${source.source}-${sourceIndex}`}>
                                    <strong className="block text-on-surface">[{source.source} · {source.refId}]</strong>
                                    <span>{source.preview}</span>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Bot size={14} className="text-primary" />
                        </div>
                        <div className="p-3 bg-surface-elevated border border-border-subtle rounded-lg flex gap-1">
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border-subtle bg-surface-container">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      onKeyDown={(e) => {
                        const nativeEvent = e.nativeEvent as KeyboardEvent & { isComposing?: boolean };
                        const composing = isComposing || nativeEvent.isComposing || e.keyCode === 229;
                        if (composing) return;

                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                      placeholder="프로젝트/기술/경험에 대해 질문해보세요"
                      className="w-full bg-surface-deep border border-border-subtle rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <button onClick={() => void handleSend()} disabled={isTyping || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
