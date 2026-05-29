import { lazy, memo, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroGate } from "../components/experience/IntroGate";
import { SITE } from "../content/siteContent";
import { premiumEase } from "../utils/animation";
import { AudioManager } from "./AudioManager";
import { EnvironmentProvider } from "./EnvironmentProvider";
import { IntelligenceAtmosphere } from "./IntelligenceAtmosphere";
import { MissionHud } from "./MissionHud";
import { NarrationSystem } from "./NarrationSystem";
import { SceneManager } from "./SceneManager";
import { TacticalCursor } from "./TacticalCursor";
import type { MissionNode } from "./types";
import { WorldStateController } from "./WorldStateController";

const ParticleEngine = lazy(() =>
  import("./ParticleEngine").then((module) => ({ default: module.ParticleEngine })),
);

const MissionEndcap = memo(() => (
  <motion.footer
    animate={{ opacity: 1, y: 0 }}
    className="relative z-10 px-5 pb-12 text-center sm:px-8"
    initial={{ opacity: 0, y: 18 }}
    transition={{ duration: 0.8, ease: premiumEase }}
  >
    <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/36">
      Mission archive maintained by {SITE.name}
    </p>
  </motion.footer>
));

const ExperienceInner = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(0.42);
  const [activeNarration, setActiveNarration] = useState<MissionNode | null>(null);

  const enterExperience = () => {
    setAudioEnabled(true);
    setHasEntered(true);
    window.setTimeout(() => window.cyberAudio?.playInterface("click"), 160);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-primary">
      <AnimatePresence>
        {!hasEntered ? <IntroGate onEnter={enterExperience} /> : null}
      </AnimatePresence>

      {hasEntered ? (
        <>
          <AudioManager
            activeNarration={activeNarration}
            enabled={audioEnabled}
            setEnabled={setAudioEnabled}
            volume={volume}
          />
          <WorldStateController />
          <IntelligenceAtmosphere />
          <Suspense fallback={null}>
            <ParticleEngine />
          </Suspense>
          <TacticalCursor />
          <MissionHud
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
            setVolume={setVolume}
            volume={volume}
          />
          <NarrationSystem activeNarration={activeNarration} />

          <main className="relative z-10">
            <SceneManager onNarration={setActiveNarration} />
          </main>

          <MissionEndcap />
        </>
      ) : null}
    </div>
  );
};

const CyberIntelligenceExperienceComponent = () => (
  <EnvironmentProvider>
    <ExperienceInner />
  </EnvironmentProvider>
);

export const CyberIntelligenceExperience = memo(CyberIntelligenceExperienceComponent);
