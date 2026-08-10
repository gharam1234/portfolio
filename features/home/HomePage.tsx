import Chatbot from "@/components/Chatbot";
import Header from "@/components/Header";
import Contact from "./Contact";
import Hero from "./Hero";
import Projects from "./Projects";
import TechStack from "./TechStack";

export default function HomePage() {
  return (
    <div className="relative scroll-smooth">
      <Header />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <Chatbot />
    </div>
  );
}
