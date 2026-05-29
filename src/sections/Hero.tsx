import { lazy, memo, Suspense } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { GithubMark, LinkedinMark } from "../components/social/SocialIcons";
import { HERO, SITE } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { premiumEase, revealContainer, revealItem } from "../utils/animation";

type HeroProps = {
  onCue?: (sound: "hover" | "click") => void;
};

const ctaStyles = {
  primary:
    "phase-pill text-[#101106] hover:shadow-[0_0_34px_rgba(183,255,42,0.42)]",
  secondary:
    "border border-white/15 bg-white/[0.035] text-primary hover:border-violet/60 hover:bg-white/[0.075]",
  ghost:
    "border border-white/10 bg-transparent text-secondary hover:border-white/25 hover:text-primary",
};

const ctaIcons = {
  GitHub: GithubMark,
  LinkedIn: LinkedinMark,
  Resume: FileText,
  default: ArrowRight,
};

const phaseDots = ["01", "02", "03", "04", "05"];

const CyberWorldScene = lazy(() =>
  import("../components/effects/CyberWorldScene").then((module) => ({
    default: module.CyberWorldScene,
  })),
);

const HeroComponent = ({ onCue }: HeroProps) => {
  const { ref } = useReveal();

  return (
    <motion.section
      animate="visible"
      className="relative isolate min-h-screen overflow-hidden px-5 pb-20 pt-28 sm:px-8"
      id="home"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <Suspense fallback={null}>
        <CyberWorldScene className="left-0 top-0 h-full w-full opacity-95" />
      </Suspense>
      <div className="cinematic-grain absolute inset-0 opacity-45" />

      <div className="absolute left-1/2 top-8 z-10 hidden -translate-x-1/2 items-center gap-8 lg:flex">
        {phaseDots.map((dot, index) => (
          <motion.span
            animate={{
              opacity: index === 0 ? [0.8, 1, 0.8] : [0.22, 0.42, 0.22],
              scale: index === 0 ? [1, 1.18, 1] : 1,
            }}
            className={`h-1.5 w-1.5 rounded-full ${
              index === 0 ? "bg-success shadow-[0_0_16px_rgba(183,255,42,0.7)]" : "bg-white/55"
            }`}
            key={dot}
            transition={{
              delay: index * 0.2,
              duration: 2.8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.42fr_0.58fr]">
          <motion.div className="max-w-xl" variants={revealItem}>
            <span className="phase-pill inline-flex rounded-sm px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
              {HERO.eyebrow}
            </span>
            <motion.h1
              className="mt-7 font-display text-5xl font-bold uppercase leading-[0.92] text-primary sm:text-6xl lg:text-7xl"
              variants={revealItem}
            >
              {HERO.phaseTitle}
            </motion.h1>
            <motion.div
              className="mt-8 flex items-center gap-4"
              variants={revealItem}
            >
              <a
                className="group inline-flex h-14 w-14 items-center justify-center border border-white/18 bg-white/[0.035] text-primary transition hover:border-success/70 hover:text-success"
                href="#about"
                onClick={() => onCue?.("click")}
                onMouseEnter={() => onCue?.("hover")}
              >
                <ArrowRight size={18} />
              </a>
              <a
                className="font-body text-sm font-bold text-white transition hover:text-success"
                href="#about"
                onClick={() => onCue?.("click")}
                onMouseEnter={() => onCue?.("hover")}
              >
                Find Out More
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ opacity: [0.72, 1, 0.72], y: [0, -8, 0] }}
            className="pointer-events-none hidden min-h-[30rem] lg:block"
            transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-5 right-5 z-10 mx-auto grid max-w-7xl gap-5 sm:left-8 sm:right-8 lg:grid-cols-[0.32fr_0.36fr_0.32fr]"
        variants={revealItem}
      >
        <div className="hidden self-end font-body text-sm font-bold leading-5 text-white/80 lg:block">
          Discover {SITE.name} - cybersecurity learning, secure interfaces, and practical tooling.
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 lg:block">
            Click & hold to listen
          </div>
          <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/25 lg:flex">
            <motion.div
              animate={{ rotate: 360 }}
              className="h-8 w-8 rounded-full border border-success/60 border-t-transparent"
              transition={{ duration: 7, ease: "linear", repeat: Infinity }}
            />
          </div>
          <a
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/80 transition hover:text-success"
            href="#projects"
          >
            Scroll to discover
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
          {HERO.ctas.slice(1).map((cta) => {
            const Icon = ctaIcons[cta.label as keyof typeof ctaIcons] ?? ctaIcons.default;
            const isExternal = cta.href.startsWith("http");

            return (
              <a
                className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-sm px-4 py-3 font-body text-sm font-bold transition duration-300 ${
                  ctaStyles[cta.variant as keyof typeof ctaStyles]
                }`}
                href={cta.href}
                key={cta.label}
                onClick={() => onCue?.("click")}
                onMouseEnter={() => onCue?.("hover")}
                rel={isExternal ? "noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                <Icon size={15} />
                {cta.label}
              </a>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
};

export const Hero = memo(HeroComponent);
