"use client";

import type { FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";

const CONTACT_EMAIL = "gharam1234@gmail.com";
const GITHUB_URL = "https://github.com/gharam1234";

function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const objective = String(formData.get("objective") || "프로젝트 문의").trim();
  const message = String(formData.get("message") || "").trim();

  const subject = encodeURIComponent(`[Synthetix Portfolio] ${objective}`);
  const body = encodeURIComponent([
    `이름: ${name || "-"}`,
    `이메일: ${email || "-"}`,
    `문의 목적: ${objective}`,
    "",
    message || "프로젝트 범위/일정/기술 요구사항을 적어주세요.",
  ].join("\n"));

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="label-bento mb-4">/_CONNECT</h2>
            <h3 className="text-5xl font-sans font-extrabold mb-8 text-on-surface">
              함께 만들면 더 <span className="text-secondary">빠르게 성장</span>합니다.
            </h3>
            <p className="text-lg text-on-surface-variant mb-12 leading-relaxed max-w-md">
              임팩트 있는 제품 개발, 기술 컨설팅, AI 기반 서비스 설계 협업을 환영합니다.
            </p>

            <div className="space-y-6">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface-deep transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="label-bento mb-0">이메일</div>
                  <div className="font-sans font-bold">{CONTACT_EMAIL}</div>
                </div>
              </a>


              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-surface-deep transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="label-bento mb-0">근무 방식</div>
                  <div className="font-sans font-bold">Remote / Global</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-10 bento-card relative">
            <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-l from-primary to-transparent" />
            <div className="absolute bottom-10 left-0 w-px h-20 bg-gradient-to-t from-primary to-transparent" />

            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-bento">이름</label>
                  <input name="name" type="text" placeholder="예: 홍길동" className="w-full bg-surface-deep/50 border border-border-subtle rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors hover:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="label-bento">이메일</label>
                  <input name="email" type="email" placeholder="you@example.com" className="w-full bg-surface-deep/50 border border-border-subtle rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors hover:border-primary/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-bento">문의 목적</label>
                <select name="objective" className="w-full bg-surface-deep/50 border border-border-subtle rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors hover:border-primary/50">
                  <option>아키텍처 컨설팅</option>
                  <option>풀스택 협업</option>
                  <option>AI 모델 개발</option>
                  <option>프로젝트 문의</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="label-bento">메시지</label>
                <textarea name="message" rows={4} placeholder="프로젝트 범위와 기술 요구사항을 알려주세요..." className="w-full bg-surface-deep/50 border border-border-subtle rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none hover:border-primary/50" />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-primary text-surface-deep font-bold rounded flex items-center justify-center gap-2 group">
                문의 보내기 <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        <footer className="mt-32 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[10px] text-text-muted">&copy; 2026 SYNTHETIX PORTFOLIO // ALL ENGINES OPERATIONAL</div>
          <div className="flex gap-8 font-mono text-[10px] text-text-muted">
            <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`} className="hover:text-primary transition-colors">PRIVACY_01</a>
            <a href="#activity" className="hover:text-primary transition-colors">SYSTEM_STATUS</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">SRC_CODE</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
