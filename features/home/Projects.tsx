"use client";

import { motion } from "motion/react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: "01",
    title: "교통봇 : 음성 기반 대중교통 안내 서비스",
    category: "AI Voice / 공공데이터",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1400",
    description:
      "호출어(KWS) 감지 → STT(Whisper) → BIS API 조회 → TTS 응답까지 음성 AI 파이프라인을 구축한 프로젝트입니다. 실사용 흐름을 중심으로 오탐 감소, 정류소명 인식 보정, 응답 지연 개선을 통해 서비스 완성도를 높였습니다.",
    highlights: [
      "openWakeWord 파인튜닝 + 연속 감지로 호출 안정성 개선",
      "Levenshtein Ratio로 정류소명 인식 오류 보정",
      "TTS API 서버 상주 방식으로 응답 시간 단축",
    ],
    tags: ["Python", "openWakeWord", "Whisper", "GPT-SoVITS", "BIS OpenAPI"],
    sourceUrl: "https://github.com/seohyeonmun/first-project",
    demoUrl: "https://youtu.be/wwp4TqpGx4g",
  },
  {
    id: "02",
    title: "SAFE Meals",
    category: "Web / Full-stack",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1400",
    description:
      "사용자 식단/안전 식품 정보를 다루는 웹 서비스 프로젝트입니다. 프론트엔드와 백엔드 전반을 연결해 실제 사용자 관점의 기능 흐름을 구현하고, 데이터 기반으로 신뢰도 있는 정보 제공 경험을 만드는 데 집중했습니다.",
    highlights: [
      "사용자 중심 플로우 기반 화면/기능 설계",
      "기능 단위 구현 + 예외 처리로 안정성 강화",
      "실서비스를 고려한 전체 사이클(기획-구현-검증) 경험",
    ],
    tags: ["JavaScript", "Web", "Frontend", "Backend", "Full-stack"],
    sourceUrl: "https://github.com/hanck1324-ship-it/code-camp_SAFE_Meals",
    demoUrl: "https://github.com/hanck1324-ship-it/code-camp_SAFE_Meals",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-4">
          <h2 className="text-5xl md:text-7xl font-sans font-extrabold flex items-baseline gap-4">
            PROJECTS <span className="label-bento inline-block mb-0 font-normal">[대표 프로젝트 2선]</span>
          </h2>
          <motion.a
            href="https://github.com/seohyeonmun/first-project"
            target="_blank"
            rel="noreferrer"
            whileHover={{ x: 10 }}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            GITHUB에서 더 보기 <ArrowUpRight size={18} />
          </motion.a>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group relative flex flex-col bento-card overflow-hidden p-0"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/60 via-surface-deep/10 to-transparent" />
                <div className="absolute top-5 left-5 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-primary uppercase">
                  {project.category}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="label-bento mb-0">프로젝트 {project.id}</span>
                  <div className="flex items-center gap-4 text-text-muted">
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} 소스 저장소`}
                      className="hover:text-primary transition-colors"
                    >
                      <Github size={17} />
                    </a>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} 데모 또는 링크`}
                      className="hover:text-primary transition-colors"
                    >
                      <ExternalLink size={17} />
                    </a>
                  </div>
                </div>

                <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{project.description}</p>

                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-surface-deep border border-border-subtle rounded text-text-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
