"use client";

import { motion } from "motion/react";
import { ChevronRight, Cpu, Globe, Rocket } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden technical-grid">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-mono font-bold tracking-widest uppercase">Web Full stack // AI Architect</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-sans font-extrabold leading-[1.1] mb-6">
            AI Web Engineer<span className="text-primary">김가람</span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            웹 부트캠프에서 다진 탄탄한 풀스택 구현 능력과 AI 부트캠프에서 익힌 모델링 역량을 결합해,
            실질적인 가치를 만드는 AI 서비스를 개발합니다. 
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a href="#projects" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-surface-deep font-bold rounded flex items-center gap-2 group transition-all">
              프로젝트 보기
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-surface-elevated border border-border-subtle text-primary font-bold rounded hover:bg-surface-elevated/80 transition-all">
              연락하기
            </motion.a>
          </div>

         
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative hidden lg:block">
          <div className="aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 border border-primary/20 rounded-xl rotate-12" />
            <div className="absolute inset-4 border border-secondary/20 rounded-xl -rotate-6" />

            <div className="w-full h-full glass rounded-2xl flex items-center justify-center overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" alt="기술 추상 이미지" className="w-full h-full object-cover opacity-40 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-transparent to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                
              </div>
            </div>

            

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }} className="absolute -bottom-6 -left-6 p-4 glass rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Rocket size={20} />
              </div>
              <div>
                <div className="text-xs font-bold">고속 최적화</div>
                <div className="text-[10px] text-text-muted">Next.js 퍼포먼스 튜닝</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
