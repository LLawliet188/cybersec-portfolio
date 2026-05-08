import { memo } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { TooltipIconButton } from "../components/common/TooltipIconButton";
import { GithubMark } from "../components/social/SocialIcons";
import { PROJECTS, PROJECTS_COPY, SECTION_LABELS } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem, softScale } from "../utils/animation";

const severityStyles = {
  HIGH: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  MED: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  LOW: "border-accent/20 bg-accent/10 text-accent",
};

const ProjectsComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="relative scroll-mt-28 px-5 py-24 sm:px-8"
      id="projects"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={PROJECTS_COPY.heading} label={SECTION_LABELS.projects} />

        <div className="grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <motion.article
              className="group flex min-h-[26rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-accent/70 hover:shadow-cyan"
              key={project.title}
              variants={revealItem}
              whileHover={softScale}
            >
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="rounded border border-white/10 bg-base/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  [ {project.status} ]
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${severityStyles[project.severity]}`}
                >
                  <ShieldAlert size={12} />
                  {PROJECTS_COPY.severityPrefix} {project.severity}
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold leading-tight text-primary">
                {project.title}
              </h3>
              <p className="mt-4 font-body text-sm leading-7 text-secondary">
                {project.description}
              </p>

              <div className="mt-auto pt-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      className="rounded border border-white/10 bg-white/[0.035] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary"
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
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export const Projects = memo(ProjectsComponent);
