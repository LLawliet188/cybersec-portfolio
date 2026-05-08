import { memo } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { HexGrid } from "../components/effects/HexGrid";
import { LightRays } from "../components/effects/LightRays";
import { GithubMark } from "../components/social/SocialIcons";
import { HERO, SITE } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { premiumEase, revealContainer, revealItem } from "../utils/animation";

const HeroComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="relative isolate flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8"
      id="home"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <LightRays
        distortion={0.06}
        followMouse={true}
        lightSpread={1.1}
        mouseInfluence={0.18}
        noiseAmount={0.03}
        rayLength={1.8}
        raysColor="#00C8FF"
        raysOrigin="top-center"
        raysSpeed={1.2}
      />
      <HexGrid className="opacity-[0.03]" />
      <motion.div
        animate={{ x: [0, 18, -8, 0], y: [0, -16, 10, 0] }}
        className="absolute -left-28 top-32 h-80 w-80 rounded-full bg-accent/15 blur-[120px]"
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        animate={{ x: [0, -12, 18, 0], y: [0, 18, -14, 0] }}
        className="absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-interactive/10 blur-[140px]"
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-4xl">
          <motion.p
            className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-accent"
            variants={revealItem}
          >
            {HERO.credential}
          </motion.p>
          <motion.h1
            className="bg-heading-gradient bg-clip-text font-display text-4xl font-bold leading-[1.02] text-transparent sm:text-5xl md:text-6xl xl:text-7xl"
            variants={revealItem}
          >
            {HERO.headingLines.map((line, index) => (
              <span
                className={index === 0 ? "block sm:whitespace-nowrap" : "block"}
                key={line}
              >
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl font-body text-lg leading-8 text-secondary sm:text-xl"
            variants={revealItem}
          >
            {HERO.subheading}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            variants={revealItem}
          >
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cta-gradient px-6 py-3 font-body text-sm font-semibold text-[#061017] shadow-cyan transition hover:shadow-[0_0_36px_rgba(0,200,255,0.34)]"
              href="#projects"
            >
              {HERO.ctas.primary}
              <ArrowRight size={16} />
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/[0.02] px-6 py-3 font-body text-sm font-semibold text-primary transition hover:border-interactive/70 hover:bg-white/[0.05]"
              href={SITE.links.github}
              rel="noreferrer"
              target="_blank"
            >
              <GithubMark size={16} />
              {HERO.ctas.secondary}
            </a>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-muted"
            variants={revealItem}
          >
            {HERO.stats.map((stat, index) => (
              <span className="flex items-center gap-4" key={stat}>
                {stat}
                {index < HERO.stats.length - 1 ? (
                  <span className="text-accent/50">/</span>
                ) : null}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative hidden lg:block"
          variants={revealItem}
          whileHover={{ y: -6, transition: { duration: 0.45, ease: premiumEase } }}
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-accent/30 via-white/5 to-transparent opacity-70 blur-sm" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {HERO.panel.label}
                </p>
                <p className="mt-1 font-body text-sm text-secondary">
                  {HERO.panel.caption}
                </p>
              </div>
              <ShieldCheck className="text-accent" size={22} />
            </div>

            <div className="grid grid-cols-[0.78fr_1fr] gap-5">
              <div className="flex aspect-square items-center justify-center rounded-md border border-white/10 bg-base/60">
                <div className="text-center">
                  <p className="font-mono text-5xl font-semibold text-primary">
                    {HERO.panel.score}
                  </p>
                  <div className="mx-auto mt-4 h-1 w-20 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ x: ["-35%", "100%"] }}
                      className="h-full w-12 bg-accent"
                      transition={{
                        duration: 2.8,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {HERO.panel.rows.map((row) => (
                  <div
                    className="rounded-md border border-white/10 bg-white/[0.025] p-4"
                    key={row.label}
                  >
                    <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                      <span className="text-secondary">{row.label}</span>
                      <span className="text-accent">{row.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10">
                      <div className="h-full w-4/5 rounded-full bg-cta-gradient" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export const Hero = memo(HeroComponent);
