import { memo, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AtmosphericBackdrop } from "./components/effects/AtmosphericBackdrop";
import { IntroGate } from "./components/experience/IntroGate";
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
import { useSoundEffects } from "./hooks/useSoundEffects";

const AppComponent = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const { enableSound, playSound, soundEnabled, toggleSound } = useSoundEffects();

  useEffect(() => {
    if (!hasEntered) return;

    let frameId = 0;

    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      frameId = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [hasEntered]);

  const enterExperience = () => {
    enableSound();
    setHasEntered(true);
    window.setTimeout(() => playSound("enter"), 40);
  };

  return (
    <div className="min-h-screen bg-base text-primary">
      <AnimatePresence>
        {!hasEntered ? <IntroGate onEnter={enterExperience} /> : null}
      </AnimatePresence>
      {hasEntered ? (
        <>
          <ScrollProgress />
          <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

          <main className="relative isolate overflow-hidden">
            <AtmosphericBackdrop />
            <Hero onCue={playSound} />
            <About />
            <Projects />
            <Skills />
            <Certifications />
            <TerminalSection />
            <OpportunityStrip />
            <Contact />
          </main>

          <Footer />
        </>
      ) : null}
    </div>
  );
};

export const App = memo(AppComponent);
