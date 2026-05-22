"use client";

import { motion } from "motion/react";
import { Brain, Database, Layout, Server, Zap } from "lucide-react";

const STACK = [
  { name: "프론트엔드 아키텍처", icon: <Layout />, items: ["React 19", "Next.js", "TypeScript", "Tailwind 4"] },
  { name: "AI 시스템", icon: <Brain />, items: ["Gemini", "TensorFlow.js", "LangChain", "OpenAI", "Vector DBs"] },
  { name: "백엔드 로직", icon: <Server />, items: ["Node.js", "Python", "GraphQL", "Express","FastAPI"] },
];

export default function TechStack() {
  return (
    <section id="stack" className="py-32 bg-surface-container relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="label-bento mb-4 flex items-center gap-2">
              <Zap size={14} /> /_TECH_CAPABILITIES
            </h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold">기획부터 배포까지, AI 제품의 전체 스펙트럼을 설계합니다.</h3>
          </div>
          <p className="text-text-muted max-w-sm">타입 안정성과 모듈화를 기반으로 사용자 경험과 알고리즘 복잡도를 연결하는 구조를 만듭니다.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK.map((group, i) => (
            <motion.div key={group.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bento-card flex flex-col h-full items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">{group.icon}</div>
              <span className="label-bento">{group.name}</span>
              <h4 className="font-sans font-bold text-xl mb-6">핵심 역량</h4>
              <div className="flex flex-wrap gap-2 mt-auto">
                {group.items.map((item) => (
                  <span key={item} className="px-2 py-1 bg-surface-elevated/50 border border-border-subtle rounded font-mono text-[10px] text-primary">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
