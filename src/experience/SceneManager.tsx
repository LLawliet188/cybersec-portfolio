import { memo, useEffect, useMemo, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FileText, Mail, Shield } from "lucide-react";
import { GithubMark, LinkedinMark } from "../components/social/SocialIcons";
import { PROJECTS, SITE, SKILL_GROUPS } from "../content/siteContent";
import { premiumEase } from "../utils/animation";
import { useEnvironment } from "./EnvironmentProvider";
import { missionNodes } from "./missionContent";
import type { MissionNode } from "./types";

type SceneManagerProps = {
  onNarration: (node: MissionNode | null) => void;
};

const ScrollRail = memo(() => (
  <div aria-hidden="true" className="relative z-0 h-[680vh] pointer-events-none">
    {missionNodes.map((node, index) => (
      <span
        className="absolute left-0 h-px w-px opacity-0"
        data-mission-node={node.id}
        id={`mission-${node.id}`}
        key={node.id}
        style={{
          top: `${(index / (missionNodes.length - 1)) * 100}%`,
        }}
      />
    ))}
  </div>
));

const ObjectDirective = ({ node }: { node: MissionNode }) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="mt-8 max-w-sm border-l border-white/16 pl-4"
    initial={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.6, ease: premiumEase }}
  >
    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/42">
      Direct object interface
    </p>
    <p className="mt-2 font-body text-sm leading-6 text-white/62">{node.interactionHint}</p>
  </motion.div>
);

const SignalStream = ({ node }: { node: MissionNode }) => (
  <div className="max-w-sm space-y-4">
    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/42">
      Live signal
    </p>
    {node.signal.slice(0, 4).map((signal, index) => (
      <motion.div
        animate={{ opacity: [0.34, 0.9, 0.34], x: [0, 10, 0] }}
        className="border-l border-white/14 pl-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/62"
        key={signal}
        transition={{
          delay: index * 0.2,
          duration: 3.6 + index * 0.35,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {signal}
      </motion.div>
    ))}
  </div>
);

const IntelList = ({ node }: { node: MissionNode }) => (
  <div className="grid gap-2">
    {node.intel.map((item, index) => (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="intel-row grid gap-2 border-l border-white/16 bg-white/[0.025] py-3 pl-4 pr-3 sm:grid-cols-[0.32fr_0.68fr]"
        initial={{ opacity: 0, x: -18 }}
        key={`${node.id}-${item.label}`}
        transition={{ delay: index * 0.07, duration: 0.5, ease: premiumEase }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/48">
          {item.label}
        </span>
        <span className="font-body text-sm font-semibold text-primary/92">{item.value}</span>
      </motion.div>
    ))}
  </div>
);

const ArsenalData = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    {SKILL_GROUPS.map((group, index) => (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="intel-plane p-4"
        initial={{ opacity: 0, y: 18 }}
        key={group.label}
        transition={{ delay: index * 0.06, duration: 0.5, ease: premiumEase }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/44">
          {group.signal}
        </p>
        <p className="mt-2 font-display text-base font-bold uppercase text-primary">
          {group.label}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/56">
          {group.skills.map((skill) => skill.name).join(" / ")}
        </p>
      </motion.div>
    ))}
  </div>
);

const OperationsData = () => (
  <div className="space-y-3">
    {PROJECTS.map((project, index) => (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="intel-plane p-4"
        initial={{ opacity: 0, y: 18 }}
        key={project.title}
        transition={{ delay: index * 0.06, duration: 0.5, ease: premiumEase }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/46">
            {project.codename}
          </p>
          <span className="rounded-full border border-white/14 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/58">
            {project.status} / {project.severity}
          </span>
        </div>
        <p className="mt-3 font-display text-lg font-bold uppercase text-primary">
          {project.title}
        </p>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-secondary">
          {project.outcome}
        </p>
      </motion.div>
    ))}
  </div>
);

const TransmissionData = ({ node }: { node: MissionNode }) => (
  <>
    <IntelList node={node} />
    <div className="mt-4 flex flex-wrap gap-3">
      <a className="secure-link" href={SITE.links.email}>
        <Mail size={15} />
        Email
      </a>
      <a className="secure-link" href={SITE.links.linkedin} rel="noreferrer" target="_blank">
        <LinkedinMark size={15} />
        LinkedIn
      </a>
      <a className="secure-link" href={SITE.links.github} rel="noreferrer" target="_blank">
        <GithubMark size={15} />
        GitHub
      </a>
    </div>
  </>
);

const SceneIntel = ({ node }: { node: MissionNode }) => {
  if (node.id === "arsenal") return <ArsenalData />;
  if (node.id === "operations") return <OperationsData />;
  if (node.id === "transmission") return <TransmissionData node={node} />;

  return (
    <>
      <IntelList node={node} />
      {node.id === "file" ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="secure-link" href={SITE.links.resume}>
            <FileText size={15} />
            Resume request
          </a>
          <a className="secure-link" href={SITE.links.email}>
            <Mail size={15} />
            Internship signal
          </a>
        </div>
      ) : null}
    </>
  );
};

const SceneManagerComponent = ({ onNarration }: SceneManagerProps) => {
  const { activatedNode, activeNode, intensity, sceneProgress, transitionProgress } =
    useEnvironment();
  const activeIndex = missionNodes.findIndex((item) => item.id === activeNode);
  const node = missionNodes[activeIndex] ?? missionNodes[0];
  const isActivated = activatedNode === node.id;

  useEffect(() => {
    onNarration(null);
  }, [activeNode, onNarration]);

  const nodeStyle = useMemo(
    () =>
      ({
        "--node-primary": node.ambient.primary,
        "--node-secondary": node.ambient.secondary,
        "--node-alert": node.ambient.alert,
      }) as CSSProperties,
    [node.ambient.alert, node.ambient.primary, node.ambient.secondary],
  );

  return (
    <>
      <section
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden px-5 py-24 sm:px-8 lg:py-28"
        style={nodeStyle}
      >
        <motion.div
          animate={{
            opacity: 0.12 + transitionProgress * 0.18 + intensity * 0.16,
            scale: 1 + transitionProgress * 0.08,
            x: (sceneProgress - 0.5) * -42,
          }}
          className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
          transition={{ duration: 0.9, ease: premiumEase }}
        />

        <div className="mx-auto grid h-full max-w-7xl items-center gap-8 lg:grid-cols-[0.45fr_0.55fr]">
          <div className="pointer-events-auto relative z-20">
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.72, ease: premiumEase }}
            >
              <span className="phase-chip inline-flex rounded-full px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.24em]">
                Phase {node.phase}
              </span>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">
                {node.label}
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.92] text-primary sm:text-6xl lg:text-7xl">
                {node.title}
              </h1>
              {!isActivated ? (
                <p className="mt-7 max-w-2xl font-body text-base leading-8 text-secondary sm:text-lg">
                  {node.dek}
                </p>
              ) : null}
            </motion.div>

            {!isActivated ? <ObjectDirective node={node} /> : null}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none relative z-10 hidden min-h-[28rem] items-center justify-center lg:flex lg:min-h-[36rem]"
          >
            <motion.div
              animate={{
                opacity: 0.32 + transitionProgress * 0.26 + intensity * 0.16,
                rotate: sceneProgress * 18,
                scale: 1 + transitionProgress * 0.08,
              }}
              className="h-[28rem] w-[28rem] rounded-full border border-white/[0.06]"
              transition={{ duration: 0.9, ease: premiumEase }}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute right-8 top-28 z-30 hidden lg:block">
          <SignalStream node={node} />
        </div>

        <div className="pointer-events-none absolute bottom-6 left-5 right-5 z-30 flex items-end justify-end gap-6 sm:left-8 sm:right-8">
          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/38 lg:flex">
            <Shield size={13} />
            Scroll transforms the chamber
            <ArrowUpRight size={13} />
          </div>
        </div>

        <AnimatePresence>
          {isActivated ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto absolute bottom-6 left-5 right-5 z-40 mx-auto max-h-[44vh] max-w-4xl overflow-auto rounded-[1.6rem] border border-white/12 bg-black/42 p-4 shadow-panel-depth backdrop-blur-2xl sm:left-8 sm:right-8 lg:bottom-10 lg:left-auto lg:max-h-[58vh] lg:w-[34rem]"
              exit={{ opacity: 0, y: 20, transition: { duration: 0.35, ease: premiumEase } }}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.6, ease: premiumEase }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/48">
                  Intelligence revealed
                </p>
                <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_20px_rgba(223,255,106,0.75)]" />
              </div>
              <SceneIntel node={node} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <ScrollRail />
    </>
  );
};

export const SceneManager = memo(SceneManagerComponent);
