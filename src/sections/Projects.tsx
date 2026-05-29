import { memo } from "react";
import { ExternalLink, GitBranch, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { TooltipIconButton } from "../components/common/TooltipIconButton";
import { GithubMark } from "../components/social/SocialIcons";
import { PROJECTS, PROJECTS_COPY, SECTION_LABELS } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem, softScale } from "../utils/animation";

const severityStyles = {
  HIGH: "border-rose-400/25 bg-rose-400/10 text-rose-100",
  MED: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  LOW: "border-accent/25 bg-accent/10 text-accent",
};

const ProjectsComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="section-frame"
      id="projects"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={PROJECTS_COPY.heading} label={SECTION_LABELS.projects} />

        <div className="space-y-6">
          {PROJECTS.map((project, projectIndex) => (
            <motion.article
              className="command-border glass-panel glass-interactive group grid overflow-hidden rounded-lg lg:grid-cols-[0.42fr_0.58fr]"
              key={project.title}
              variants={revealItem}
              whileHover={softScale}
            >
              <div className="relative min-h-72 overflow-hidden border-b border-white/10 bg-base/60 p-5 lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 scanline-mask opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,200,255,0.18),transparent_18rem)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase tracking-signal text-primary">
                      {project.codename}
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-signal ${severityStyles[project.severity]}`}
                    >
                      <ShieldAlert size={13} />
                      {PROJECTS_COPY.severityPrefix}: {project.severity}
                    </span>
                  </div>

                  <div className="mx-auto my-8 flex aspect-square w-48 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] sm:w-56">
                    <svg className="h-full w-full" viewBox="0 0 240 240">
                      <defs>
                        <linearGradient
                          id={`project-line-${projectIndex}`}
                          x1="0"
                          x2="1"
                          y1="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#00C8FF" />
                          <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="120"
                        cy="120"
                        fill="none"
                        r="82"
                        stroke="rgba(255,255,255,0.12)"
                      />
                      <circle
                        cx="120"
                        cy="120"
                        fill="none"
                        r="50"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <motion.path
                        animate={{ pathLength: [0.2, 1, 0.2] }}
                        d="M54 151 L88 86 L121 128 L156 62 L190 149"
                        fill="none"
                        stroke={`url(#project-line-${projectIndex})`}
                        strokeLinecap="round"
                        strokeWidth="3"
                        transition={{
                          duration: 4.8,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                      {[
                        [54, 151],
                        [88, 86],
                        [121, 128],
                        [156, 62],
                        [190, 149],
                      ].map(([cx, cy], index) => (
                        <motion.circle
                          animate={{ opacity: [0.45, 1, 0.45] }}
                          cx={cx}
                          cy={cy}
                          fill={index % 2 === 0 ? "#00C8FF" : "#34D399"}
                          key={`${project.title}-${cx}-${cy}`}
                          r="5"
                          transition={{
                            delay: index * 0.22,
                            duration: 2.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {project.telemetry.map((item) => (
                      <div
                        className="rounded-md border border-white/10 bg-base/60 px-3 py-2 font-mono text-[10px] uppercase tracking-signal text-secondary"
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative p-6 sm:p-8">
                <div className="absolute right-6 top-6 font-mono text-6xl font-semibold text-white/[0.03]">
                  0{projectIndex + 1}
                </div>
                <div className="relative">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-md border border-success/20 bg-success/10 px-3 py-2 font-mono text-[10px] uppercase tracking-signal text-success">
                      [ {project.status} ]
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-signal text-secondary">
                      <GitBranch size={13} />
                      {PROJECTS_COPY.stackLabel}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-2xl font-body text-base leading-8 text-secondary">
                    {project.description}
                  </p>
                  <p className="mt-4 max-w-2xl border-l border-accent/35 pl-4 font-body text-sm leading-7 text-primary/85">
                    {project.outcome}
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {project.metrics.map((metric) => (
                      <div
                        className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                        key={`${project.title}-${metric.label}`}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-signal text-muted">
                          {metric.label}
                        </p>
                        <p className="mt-2 font-display text-lg font-semibold text-primary">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          className="rounded-md border border-white/10 bg-base/55 px-3 py-2 font-mono text-[10px] uppercase tracking-signal text-secondary"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <TooltipIconButton
                        href={project.githubUrl}
                        icon={GithubMark}
                        label={PROJECTS_COPY.githubLabel}
                      />
                      <TooltipIconButton
                        href={project.liveUrl}
                        icon={ExternalLink}
                        label={PROJECTS_COPY.externalLabel}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export const Projects = memo(ProjectsComponent);
