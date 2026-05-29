import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { premiumEase } from "../utils/animation";
import type { MissionNode } from "./types";

type NarrationSystemProps = {
  activeNarration: MissionNode | null;
};

const NarrationSystemComponent = ({ activeNarration }: NarrationSystemProps) => {
  return (
    <AnimatePresence>
      {activeNarration ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 border border-white/12 bg-black/45 px-5 py-4 text-center shadow-panel-depth backdrop-blur-xl"
          exit={{ opacity: 0, y: 18, transition: { duration: 0.45, ease: premiumEase } }}
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-success">
            Narration Active / {activeNarration.label}
          </p>
          <p className="mt-2 font-body text-sm leading-6 text-primary/90">
            {activeNarration.narration}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export const NarrationSystem = memo(NarrationSystemComponent);
