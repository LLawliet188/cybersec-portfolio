import { memo } from "react";
import { motion } from "framer-motion";
import { ATMOSPHERE } from "../../content/siteContent";

const stars = Array.from({ length: 28 }, (_, index) => ({
  id: `star-${index}`,
  left: `${6 + ((index * 31) % 88)}%`,
  top: `${8 + ((index * 17) % 54)}%`,
  delay: (index % 7) * 0.45,
  size: index % 5 === 0 ? 3 : 2,
}));

const AtmosphericBackdropComponent = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05040A_0%,#140727_38%,#08030F_72%,#020207_100%)]" />
      <motion.div
        animate={{ opacity: [0.72, 0.92, 0.72], scale: [1, 1.04, 1] }}
        className="absolute inset-x-[-12%] top-0 h-[30rem] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 46% 24%, rgba(56,189,248,0.22), transparent 28rem), linear-gradient(90deg, rgba(30,10,54,0.3), rgba(244,114,182,0.36), rgba(56,189,248,0.16), transparent)",
        }}
        transition={{ duration: 11, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={{ x: [0, 28, -16, 0], opacity: [0.28, 0.48, 0.28] }}
        className="absolute bottom-[-16rem] left-1/2 h-[34rem] w-[74rem] -translate-x-1/2 rounded-[50%] bg-violet/30 blur-[120px]"
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      {stars.map((star) => (
        <motion.span
          className="absolute rounded-full bg-white"
          key={star.id}
          style={{
            height: star.size,
            left: star.left,
            top: star.top,
            width: star.size,
          }}
          animate={{ opacity: [0.12, 0.85, 0.12], scale: [0.8, 1.4, 0.8] }}
          transition={{
            delay: star.delay,
            duration: 4.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      <svg
        className="absolute inset-x-0 bottom-0 h-[58vh] w-full opacity-95"
        preserveAspectRatio="none"
        viewBox="0 0 1440 620"
      >
        <defs>
          <linearGradient id="mountain-a" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#12081D" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#020207" />
          </linearGradient>
          <linearGradient id="ground-glow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="45%" stopColor="#A855F7" stopOpacity="0.34" />
            <stop offset="72%" stopColor="#22D3EE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 240L90 210L165 250L250 150L330 258L430 212L520 264L610 190L690 250L780 188L875 250L980 118L1085 260L1190 172L1290 236L1440 150V620H0Z"
          fill="url(#mountain-a)"
        />
        <path
          d="M0 330L130 280L260 360L410 288L560 365L715 300L860 370L1030 285L1210 370L1440 305V620H0Z"
          fill="#050309"
          opacity="0.86"
        />
        <ellipse cx="740" cy="504" fill="url(#ground-glow)" rx="500" ry="74" />
      </svg>

      <div className="ambient-noise absolute inset-0 opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.22)_54%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-base/70 to-transparent" />
      <div className="absolute right-10 top-32 hidden gap-6 lg:flex">
        {ATMOSPHERE.fragments.map((fragment, index) => (
          <motion.span
            animate={{ opacity: [0.16, 0.48, 0.16], y: [0, -6, 0] }}
            className="font-mono text-[10px] uppercase tracking-signal text-white/30"
            key={fragment}
            transition={{
              delay: index * 0.55,
              duration: 6 + index * 0.6,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {fragment}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export const AtmosphericBackdrop = memo(AtmosphericBackdropComponent);
