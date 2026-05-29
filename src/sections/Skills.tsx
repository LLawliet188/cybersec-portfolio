import { memo, useMemo, useState } from "react";
import {
  Activity,
  Atom,
  Box,
  Braces,
  Bug,
  Database,
  GitBranch,
  Laptop,
  Palette,
  Radio,
  Server,
  Shield,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { SECTION_LABELS, SKILL_GROUPS, SKILLS_COPY, type Skill } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { premiumEase, revealContainer, revealItem, softScale } from "../utils/animation";

const skillIcons = {
  react: Atom,
  typescript: Braces,
  tailwind: Palette,
  python: Terminal,
  sql: Database,
  node: Server,
  wireshark: Activity,
  burp: Bug,
  nmap: Radio,
  linux: Laptop,
  git: GitBranch,
  docker: Box,
  fallback: Shield,
};

const dotsByLevel: Record<Skill["level"], string[]> = {
  learning: ["filled", "filled", "empty"],
  comfortable: ["filled", "filled", "filled"],
};

const SkillsComponent = () => {
  const { ref, isInView } = useReveal();
  const [activeTab, setActiveTab] = useState(SKILL_GROUPS[0].label);
  const activeGroup = useMemo(
    () => SKILL_GROUPS.find((group) => group.label === activeTab) ?? SKILL_GROUPS[0],
    [activeTab],
  );

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="section-frame"
      id="skills"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={SKILLS_COPY.heading} label={SECTION_LABELS.skills} />

        <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <motion.div
            className="glass-panel rounded-lg p-2"
            variants={revealItem}
          >
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {SKILL_GROUPS.map((group) => (
                <button
                  className={`relative min-w-44 rounded-md px-4 py-4 text-left transition ${
                    activeTab === group.label
                      ? "text-primary"
                      : "text-secondary hover:bg-white/[0.035] hover:text-primary"
                  }`}
                  key={group.label}
                  onClick={() => setActiveTab(group.label)}
                  type="button"
                >
                  {activeTab === group.label ? (
                    <motion.span
                      className="absolute inset-0 rounded-md border border-accent/35 bg-accent/10"
                      layoutId="skill-active-tab"
                      transition={{ duration: 0.42, ease: premiumEase }}
                    />
                  ) : null}
                  <span className="relative z-10 block font-mono text-[10px] uppercase tracking-signal text-accent">
                    {group.signal}
                  </span>
                  <span className="relative z-10 mt-2 block font-display text-xl font-semibold">
                    {group.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="command-border glass-panel relative overflow-hidden rounded-lg p-5 sm:p-6"
            variants={revealItem}
          >
            <div className="absolute inset-x-0 top-0 h-px signal-line opacity-60" />
            <div className="mb-7 grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
              <div>
                <p className="micro-label">
                  {SKILLS_COPY.activePrefix} / {activeGroup.signal}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-primary">
                  {activeGroup.label}
                </h3>
                <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-secondary">
                  {activeGroup.summary}
                </p>
              </div>
              <div className="relative hidden min-h-28 overflow-hidden rounded-lg border border-white/10 bg-base/60 lg:block">
                <div className="absolute inset-6 border border-accent/15" />
                <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 bg-accent/20" />
                <div className="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 bg-accent/20" />
                <motion.div
                  animate={{ rotate: 360 }}
                  className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border border-accent/30"
                  transition={{ duration: 16, ease: "linear", repeat: Infinity }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 sm:grid-cols-2"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 18 }}
                key={activeGroup.label}
                transition={{ duration: 0.42, ease: premiumEase }}
              >
                {activeGroup.skills.map((skill) => {
                  const Icon =
                    skillIcons[skill.icon as keyof typeof skillIcons] ??
                    skillIcons.fallback;

                  return (
                    <motion.div
                      className="glass-interactive group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-5"
                      key={skill.name}
                      whileHover={softScale}
                    >
                      <div className="absolute -right-10 -top-10 h-28 w-28 rotate-45 bg-accent/[0.04] blur-2xl transition group-hover:bg-accent/[0.08]" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-base/60 text-accent transition group-hover:border-accent/50">
                            <Icon size={20} />
                          </div>
                          <div>
                            <h4 className="font-display text-xl font-semibold text-primary">
                              {skill.name}
                            </h4>
                            <p className="mt-2 font-body text-sm leading-6 text-secondary">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                        <div
                          aria-label={SKILLS_COPY.levelLabels[skill.level]}
                          className="flex gap-1 pt-1"
                        >
                          {dotsByLevel[skill.level].map((dot, index) => (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                dot === "filled" ? "bg-accent" : "bg-white/15"
                              }`}
                              key={`${skill.name}-${index}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="relative mt-5 font-mono text-[10px] uppercase tracking-signal text-muted">
                        {SKILLS_COPY.levelLabels[skill.level]}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export const Skills = memo(SkillsComponent);
