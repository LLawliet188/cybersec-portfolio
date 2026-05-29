import { memo } from "react";
import { motion } from "framer-motion";
import { premiumEase } from "../utils/animation";
import { missionNodes } from "./missionContent";
import { useEnvironment } from "./EnvironmentProvider";

const telemetry = [
  "TRACE ROUTE",
  "IDENTITY LOCK",
  "SIGNAL CLEAN",
  "IOC WATCH",
  "VAULT CHECK",
  "REMOTE / GERMANY",
];

const IntelligenceAtmosphereComponent = () => {
  const { activeNode, holdNode, intensity, mode, progress, sceneProgress, transitionProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const isAlert = mode === "breach";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void"
    >
      <motion.div
        animate={{
          background: `linear-gradient(180deg, #020107 0%, ${node.ambient.primary}33 36%, #070311 70%, #010104 100%)`,
        }}
        className="absolute inset-0"
        transition={{ duration: 1.2, ease: premiumEase }}
      />

      <motion.div
        animate={{
          opacity: isAlert ? 0.46 + transitionProgress * 0.12 : 0.3 + intensity * 0.16 + transitionProgress * 0.1,
          scale: 1 + progress * 0.08 + intensity * 0.05 + transitionProgress * 0.04,
          x: holdNode ? 18 : (sceneProgress - 0.5) * 34,
        }}
        className="absolute left-1/2 top-[-18rem] h-[52rem] w-[82rem] -translate-x-1/2 rounded-[50%] blur-[86px]"
        style={{
          background: `radial-gradient(ellipse at center, ${node.ambient.secondary}66, ${node.ambient.primary}22 42%, transparent 72%)`,
        }}
        transition={{ duration: 1.6, ease: premiumEase }}
      />

      <motion.div
        animate={{
          opacity: 0.36 + intensity * 0.2 + transitionProgress * 0.18,
          rotateX: 64 - intensity * 6 - transitionProgress * 8,
          scale: 1 + progress * 0.1 + transitionProgress * 0.07,
          y: progress * -70 - transitionProgress * 30,
        }}
        className="absolute bottom-[-17rem] left-1/2 h-[42rem] w-[95rem] -translate-x-1/2 rounded-[50%] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_58%)]"
        transition={{ duration: 1.1, ease: premiumEase }}
      />

      <motion.div
        animate={{
          opacity: isAlert ? 0.42 : 0.22 + transitionProgress * 0.16,
          rotate: isAlert ? -6 : (sceneProgress - 0.5) * 4,
          scale: 1 + intensity * 0.06 + transitionProgress * 0.08,
        }}
        className="intelligence-grid absolute inset-x-[-10%] bottom-[-4rem] h-[68vh] origin-bottom"
        transition={{ duration: 0.9, ease: premiumEase }}
      />

      <motion.div
        animate={{
          opacity: 0.42 + intensity * 0.18 + transitionProgress * 0.22,
          rotate: holdNode ? 18 : 0,
          scale: 1 + intensity * 0.12 + transitionProgress * 0.1,
        }}
        className="absolute left-1/2 top-[18vh] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/10"
        transition={{ duration: 1.1, ease: premiumEase }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          className="absolute inset-8 rounded-full border border-dashed border-white/10"
          transition={{ duration: isAlert ? 18 : 34, ease: "linear", repeat: Infinity }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          className="absolute inset-20 rounded-full border border-white/10"
          transition={{ duration: isAlert ? 24 : 46, ease: "linear", repeat: Infinity }}
        />
        <motion.div
          animate={{
            boxShadow: `0 0 ${42 + intensity * 64}px ${node.ambient.secondary}66`,
            opacity: 0.18 + intensity * 0.16,
          }}
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: node.ambient.secondary }}
          transition={{ duration: 1.1, ease: premiumEase }}
        />
      </motion.div>

      <div className="absolute inset-0 opacity-[0.11]">
        {telemetry.map((item, index) => (
          <motion.span
            animate={{
              opacity: [0.12, holdNode ? 0.62 : 0.34, 0.12],
              y: [0, -18 - index * 3, 0],
            }}
            className="absolute font-mono text-[9px] uppercase tracking-[0.28em] text-white/55"
            key={item}
            style={{
              left: `${8 + ((index * 17) % 78)}%`,
              top: `${16 + ((index * 13) % 58)}%`,
            }}
            transition={{
              delay: index * 0.32,
              duration: 7 + index * 0.7,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>

      <motion.div
        animate={{
          opacity: isAlert ? 0.22 : 0.08 + intensity * 0.1,
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.78)_100%)]"
      />
      <div className="scanline-mask absolute inset-0 opacity-[0.08]" />
      <div className="ambient-noise absolute inset-0 opacity-[0.09] mix-blend-screen" />
      <motion.div
        animate={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[70] h-px w-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${node.ambient.alert}, ${node.ambient.secondary})`,
        }}
        transition={{ duration: 0.15, ease: "linear" }}
      />
    </div>
  );
};

export const IntelligenceAtmosphere = memo(IntelligenceAtmosphereComponent);
