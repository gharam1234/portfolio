"use client";

import { motion } from "motion/react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: "01",
    title: "ApplyFlow",
    category: "Data Pipeline / Full-stack",
    meta: "개인 프로젝트 · 기획·수집·백엔드·UI 전 과정",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400",
    description:
      "11개 채용·프로젝트 플랫폼의 데이터를 수집하고 공통 모델로 정규화해, 신입·재택·지원 가능 여부를 판단 근거와 함께 보여주는 운영형 웹 서비스입니다.",
    highlights: [
      "출처별 수집기와 공통 정규화 모델을 분리해 구조 변경에 대응",
      "조건 일치·확인 필요·제외 판정과 원본·변경 이력 저장",
      "페이지 공통 문구로 인한 재택 오탐을 공고별 근거 검증으로 개선",
    ],
    outcome: "11개 외부 출처 연동 · 37개 자동 테스트",
    tags: ["Python", "FastAPI", "Pydantic", "SQLite", "httpx", "Pytest"],
    sourceUrl: "https://github.com/gharam1234/applyflow",
    demoUrl: "https://applyflow-sand-seven.vercel.app",
  },
  {
    id: "02",
    title: "Synthetix RAG",
    category: "AI Knowledge Assistant",
    meta: "개인 프로젝트 · RAG 파이프라인·관리 기능·프론트엔드",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1400",
    description:
      "포트폴리오 문서를 임베딩하고 관련 문맥을 검색해 근거 기반 답변을 생성하는 RAG 지식지원 서비스입니다. 같은 구조를 강의자료 질의응답과 학습 복습 지원으로 확장할 수 있습니다.",
    highlights: [
      "문서 분할 → Gemini 임베딩 → Pinecone 검색 → 답변 생성 파이프라인",
      "대화 이력을 검색 질의에 반영하고 사용한 문서 출처를 답변에 표시",
      "관리자 문서 편집·재색인 기능과 API 권한 검증",
    ],
    outcome: "근거 없는 질문은 정보 부족으로 안내 · 관리자 재색인 지원",
    tags: ["Next.js", "TypeScript", "Gemini", "Pinecone", "Firebase", "RAG"],
    sourceUrl: "https://github.com/gharam1234/portfolio",
    demoUrl: "https://portfolio-gharams-projects.vercel.app",
  },
  {
    id: "03",
    title: "교통봇 : 음성 기반 대중교통 안내",
    category: "AI Voice / Public API",
    meta: "팀 프로젝트 · TTS 및 API 서버 담당",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1400",
    description:
      "호출어 감지, 음성 인식, 버스 정보 조회, 음성 합성을 하나의 사용자 흐름으로 연결한 팀 프로젝트입니다. TTS와 API 서버 구성을 담당했습니다.",
    highlights: [
      "GPT-SoVITS 기반 TTS와 API 서버 구성",
      "모델 메모리 상주 방식으로 반복 요청 지연 개선",
      "KWS·STT·BIS OpenAPI·TTS 모듈을 서비스 흐름으로 연결",
    ],
    outcome: "TTS 응답 약 20초 → 1~3초 수준으로 단축",
    tags: ["Python", "GPT-SoVITS", "FastAPI", "Whisper", "BIS OpenAPI"],
    sourceUrl: "https://github.com/seohyeonmun/first-project",
    demoUrl: "https://youtu.be/wwp4TqpGx4g",
  },
  {
    id: "04",
    title: "SAFE Meals",
    category: "Web / Full-stack",
    meta: "팀 프로젝트 · 사용자 흐름 및 AI 결과 화면",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1400",
    description:
      "알레르기와 식이 제한 정보를 관리하고 메뉴 스캔 결과를 안전 단계로 안내하는 모바일 우선 웹 서비스 프로젝트입니다.",
    highlights: [
      "메뉴 스캔부터 위험도 결과까지 사용자 흐름 설계",
      "다국어·모바일 환경을 고려한 화면 구조",
      "예외 상황을 포함한 AI 분석 결과 표현 방식 정리",
    ],
    outcome: "기획·구현·검증 전 과정을 경험한 팀 프로젝트",
    tags: ["Next.js", "TypeScript", "OCR", "Gemini", "Mobile-first"],
    sourceUrl: "https://github.com/hanck1324-ship-it/code-camp_SAFE_Meals",
    demoUrl: "",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-4">
          <div>
            <h2 className="text-5xl md:text-7xl font-sans font-extrabold">PROJECTS</h2>
            <p className="mt-4 max-w-2xl text-on-surface-variant">
              구현 기술보다 해결한 문제, 판단 근거, 개선 과정을 중심으로 정리했습니다.
            </p>
          </div>
          <motion.a
            href="https://github.com/gharam1234"
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
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col bento-card overflow-hidden p-0"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={project.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-surface-deep/20 to-transparent" />
                <div className="absolute top-5 left-5 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-primary uppercase">
                  {project.category}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="label-bento mb-0">프로젝트 {project.id}</span>
                </div>

                <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
                <p className="text-xs font-mono text-primary/90">{project.meta}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{project.description}</p>

                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2"><span className="text-primary">•</span><span>{item}</span></li>
                  ))}
                </ul>

                <p className="rounded border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-mono text-primary">
                  {project.outcome}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-surface-deep border border-border-subtle rounded text-text-muted">#{tag}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-bold text-surface-deep hover:bg-primary/90">
                      <ExternalLink size={15} /> 서비스 보기
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-border-subtle px-4 py-2 text-xs font-bold text-on-surface hover:border-primary hover:text-primary">
                      <Github size={15} /> GitHub 코드
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
