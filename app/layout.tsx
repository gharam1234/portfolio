import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-gharams-projects.vercel.app"),
  title: "김가람 | Full-stack · AI Product Engineer",
  description: "외부 데이터 연동, 상태 관리, RAG 학습지원 경험을 담은 김가람의 개발 포트폴리오",
  openGraph: {
    title: "김가람 | Full-stack · AI Product Engineer",
    description: "ApplyFlow와 Synthetix RAG를 중심으로 문제 해결 과정을 보여주는 개발 포트폴리오",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "김가람 개발 포트폴리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "김가람 | Full-stack · AI Product Engineer",
    description: "ApplyFlow와 Synthetix RAG를 중심으로 문제 해결 과정을 보여주는 개발 포트폴리오",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
