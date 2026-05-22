import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "신세틱스 포트폴리오",
  description: "AI 및 웹 엔지니어링 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
