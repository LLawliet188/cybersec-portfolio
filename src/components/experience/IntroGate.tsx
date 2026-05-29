import { memo } from "react";
import { motion } from "framer-motion";
import { HERO } from "../../content/siteContent";
import { premiumEase } from "../../utils/animation";

type IntroGateProps = {
  onEnter: () => void;
};

const phaseDots = ["01", "02", "03", "04", "05"];

const IntroGateComponent = ({ onEnter }: IntroGateProps) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#05040A] text-primary"
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.9, ease: premiumEase } }}
      initial={{ opacity: 1 }}
    >
      <div className="ambient-noise absolute inset-0 opacity-[0.08]" />
      <motion.div
        animate={{ pathLength: [0.2, 1, 0.55], opacity: [0.2, 0.58, 0.2] }}
        className="absolute inset-x-0 top-[36%] h-40"
        transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
      >
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 180">
          <path
            d="M0 90C140 28 230 134 350 82C452 38 552 72 650 92C752 112 840 10 980 64C1124 119 1210 70 1440 52"
            fill="none"
            stroke="rgba(168,85,247,0.38)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <div className="absolute top-7 text-center font-mono text-[10px] uppercase tracking-[0.24em]">
        Loading 5 phases
      </div>
      <div className="absolute top-1/2 flex -translate-y-44 gap-8">
        {phaseDots.map((dot, index) => (
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.88, 1.18, 0.88] }}
            className="h-1.5 w-1.5 rounded-full bg-white"
            key={dot}
            transition={{
              delay: index * 0.18,
              duration: 2.4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 font-mono text-[10px] uppercase tracking-[0.24em] text-success"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          Manas // Cybersec
        </motion.p>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-bold uppercase leading-[0.9] sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          transition={{ delay: 0.18, duration: 1, ease: premiumEase }}
        >
          {HERO.introTitle}
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-7 max-w-2xl font-body text-sm leading-7 text-secondary sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.34, duration: 0.9, ease: premiumEase }}
        >
          {HERO.introSubtitle}
        </motion.p>

        <motion.button
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-primary transition hover:text-success"
          initial={{ opacity: 0, y: 16 }}
          onClick={onEnter}
          transition={{ delay: 0.5, duration: 0.75, ease: premiumEase }}
          type="button"
        >
          {HERO.introAction}
        </motion.button>
      </div>

      <div className="absolute bottom-10 font-mono text-[10px] uppercase tracking-[0.24em]">
        {HERO.introHint}
      </div>
    </motion.div>
  );
};

export const IntroGate = memo(IntroGateComponent);
