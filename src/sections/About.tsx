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
      className="relative scroll-mt-28 px-5 py-24 sm:px-8"
      id="about"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={ABOUT.heading} label={SECTION_LABELS.about} />

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div className="space-y-5" variants={revealItem}>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <p className="font-body text-lg leading-8 text-secondary">
                {ABOUT.body}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-base/50 text-accent">
                  <GraduationCap size={19} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    {ABOUT.education.title}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-primary">
                    {ABOUT.education.degree}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-6 text-secondary">
                    {ABOUT.education.institution} - {ABOUT.education.location}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-md border border-white/10 bg-base/50 px-4 py-3">
                <IdCard className="text-accent" size={16} />
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-secondary">
                  {ABOUT.education.matriculationLabel}{" "}
                  <span className="text-primary">
                    {ABOUT.education.matriculationNumber}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={revealItem}>
            <h3 className="font-display text-xl font-semibold text-primary">
              {ABOUT.focusTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT.focusAreas.map((area) => {
                const Icon = focusIcons[area.icon as keyof typeof focusIcons];

                return (
                  <motion.div
                    className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-accent/60 hover:shadow-cyan-sm"
                    key={area.title}
                    whileHover={softScale}
                  >
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-base/50 text-accent transition group-hover:border-accent/50">
                      <Icon size={18} />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-primary">
                      {area.title}
                    </h4>
                    <p className="mt-2 font-body text-sm leading-6 text-secondary">
                      {area.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
          variants={revealItem}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {ABOUT.timeline.map((item, index) => (
              <div className="flex flex-1 items-center gap-4" key={item.label}>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    {item.date}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-primary">
                    {item.label}
                  </p>
                </div>
                {index < ABOUT.timeline.length - 1 ? (
                  <div className="hidden h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export const About = memo(AboutComponent);
