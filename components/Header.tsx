"use client";

import { motion } from "motion/react";
import { Terminal, Github, Linkedin, Menu } from "lucide-react";

const GITHUB_URL = "https://github.com/gharam1234";
const LINKEDIN_URL = "#contact";

const NAV_ITEMS = [
  { label: "소개", href: "#hero" },
  { label: "기술 스택", href: "#stack" },
  { label: "프로젝트", href: "#projects" },
  { label: "활동", href: "#activity" },
  { label: "연락처", href: "#contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 glass border-b border-border-subtle bg-surface-deep/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Terminal size={18} className="text-surface-deep" />
          </div>
          <span className="font-sans font-bold text-lg hidden sm:block">SYNTHETIX.IO</span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4 border-r border-border-subtle pr-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 프로필 열기"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href={LINKEDIN_URL}
              aria-label="연락처 섹션으로 이동"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="md:hidden p-2 hover:bg-white/5 rounded-lg">
            <Menu size={20} />
          </motion.button>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex px-4 py-2 bg-primary text-surface-deep rounded font-semibold text-sm"
          >
            함께 만들기
          </motion.a>
        </div>
      </div>
    </header>
  );
}
