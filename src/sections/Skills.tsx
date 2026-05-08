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
      className="relative scroll-mt-28 px-5 py-24 sm:px-8"
      id="skills"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={SKILLS_COPY.heading} label={SECTION_LABELS.skills} />

        <motion.div
          className="mb-8 flex overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1 backdrop-blur-xl"
          variants={revealItem}
        >
          {SKILL_GROUPS.map((group) => (
            <button
              className={`relative min-w-32 rounded-md px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] transition ${
                activeTab === group.label ? "text-primary" : "text-secondary hover:text-primary"
              }`}
              key={group.label}
              onClick={() => setActiveTab(group.label)}
              type="button"
            >
              {activeTab === group.label ? (
                <motion.span
                  className="absolute inset-0 rounded-md border border-accent/40 bg-accent/10"
                  layoutId="skill-active-tab"
                  transition={{ duration: 0.42, ease: premiumEase }}
                />
              ) : null}
              <span className="relative z-10">{group.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 14 }}
            key={activeGroup.label}
            transition={{ duration: 0.42, ease: premiumEase }}
          >
            {activeGroup.skills.map((skill) => {
              const Icon = skillIcons[skill.icon as keyof typeof skillIcons] ?? skillIcons.fallback;

              return (
                <motion.div
                  className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-accent/70 hover:shadow-cyan-sm"
                  key={skill.name}
                  whileHover={softScale}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent transition group-hover:via-accent/70" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-base/50 text-accent transition group-hover:border-accent/50">
                        <Icon size={19} />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-primary">
                        {skill.name}
                      </h3>
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
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {SKILLS_COPY.levelLabels[skill.level]}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export const Skills = memo(SkillsComponent);
