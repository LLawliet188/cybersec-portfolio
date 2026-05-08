import { memo, useEffect } from "react";
import { HexGrid } from "./components/effects/HexGrid";
import { ScrollProgress } from "./components/effects/ScrollProgress";
import { Navbar } from "./components/layout/Navbar";
import { About } from "./sections/About";
import { Certifications } from "./sections/Certifications";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { OpportunityStrip } from "./sections/OpportunityStrip";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { TerminalSection } from "./sections/TerminalSection";

const AppComponent = () => {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="min-h-screen bg-base text-primary">
      <ScrollProgress />
      <Navbar />

      <main className="relative isolate overflow-hidden">
        <HexGrid className="fixed inset-0 -z-10 opacity-[0.03]" />
        <div className="fixed left-1/2 top-1/3 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/[0.035] blur-[150px]" />
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Projects />
        <TerminalSection />
        <OpportunityStrip />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export const App = memo(AppComponent);
