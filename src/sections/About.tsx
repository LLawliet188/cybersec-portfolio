import { memo } from "react";
import {
  GraduationCap,
  IdCard,
  Lock,
  Network,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { ABOUT, SECTION_LABELS } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem, softScale } from "../utils/animation";

const focusIcons = {
  network: Network,
  scan: ScanSearch,
  shield: ShieldCheck,
  lock: Lock,
};

const AboutComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="section-frame"
      id="about"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={ABOUT.heading} label={SECTION_LABELS.about} />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            className="command-border glass-panel relative overflow-hidden rounded-lg p-6 sm:p-8"
            variants={revealItem}
          >
            <div className="absolute -right-24 top-10 h-72 w-72 bg-[conic-gradient(from_120deg,rgba(0,200,255,0.18),rgba(52,211,153,0.08),transparent)] opacity-70 blur-3xl" />
            <div className="relative">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-base/60 text-accent">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="micro-label">{ABOUT.education.title}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-primary">
                    {ABOUT.education.degree}
                  </h3>
                </div>
              </div>

              <p className="font-body text-lg leading-8 text-secondary">
                {ABOUT.body}
              </p>

              <div className="mt-7 rounded-lg border border-white/10 bg-base/55 p-4">
                <div className="flex items-start gap-3">
                  <IdCard className="mt-0.5 text-accent" size={18} />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-signal text-muted">
                      {ABOUT.education.matriculationLabel}
                    </p>
                    <p className="mt-1 font-mono text-sm text-primary">
                      {ABOUT.education.matriculationNumber}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="font-body text-sm text-secondary">
                    {ABOUT.education.institution}
                  </p>
                  <p className="font-body text-sm text-secondary sm:text-right">
                    {ABOUT.education.location}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {ABOUT.highlights.map((item) => (
                  <div
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                    key={item.label}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-signal text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-base font-semibold text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-5" variants={revealItem}>
            <div className="flex items-end justify-between gap-5">
              <h3 className="font-display text-2xl font-semibold text-primary">
                {ABOUT.focusTitle}
              </h3>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent sm:block" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT.focusAreas.map((area, index) => {
                const Icon = focusIcons[area.icon as keyof typeof focusIcons];

                return (
                  <motion.div
                    className="glass-panel glass-interactive group relative overflow-hidden rounded-lg p-5"
                    key={area.title}
                    whileHover={softScale}
                  >
                    <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-signal text-white/15">
                      0{index + 1}
                    </div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-base/60 text-accent transition group-hover:border-accent/50">
                      <Icon size={19} />
                    </div>
                    <h4 className="font-display text-xl font-semibold text-primary">
                      {area.title}
                    </h4>
                    <p className="mt-3 font-body text-sm leading-6 text-secondary">
                      {area.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 grid gap-4 rounded-lg border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl lg:grid-cols-3"
          variants={revealItem}
        >
          {ABOUT.timeline.map((item, index) => (
            <div
              className="relative overflow-hidden rounded-lg border border-white/10 bg-base/50 p-5"
              key={item.label}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-accent/10 font-mono text-xs text-accent">
                  {index + 1}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-signal text-accent">
                    {item.date}
                  </p>
                  <h4 className="mt-2 font-display text-xl font-semibold text-primary">
                    {item.label}
                  </h4>
                  <p className="mt-2 font-body text-sm leading-6 text-secondary">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export const About = memo(AboutComponent);
