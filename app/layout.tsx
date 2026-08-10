import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김가람 | Full-stack · AI Product Engineer",
  description: "외부 데이터 연동, 상태 관리, RAG 학습지원 경험을 담은 김가람의 개발 포트폴리오",
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
