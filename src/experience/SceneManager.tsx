import { memo, useEffect, useMemo, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FileText, Mail, Shield, Zap } from "lucide-react";
import { GithubMark, LinkedinMark } from "../components/social/SocialIcons";
import { PROJECTS, SITE, SKILL_GROUPS } from "../content/siteContent";
import { premiumEase } from "../utils/animation";
import { useEnvironment } from "./EnvironmentProvider";
import { InteractionController, type HoldInteractionBind } from "./InteractionController";
import { missionNodes } from "./missionContent";
import type { MissionNode } from "./types";

type SceneManagerProps = {
  onNarration: (node: MissionNode | null) => void;
};

const artifactLabels: Record<MissionNode["artifact"], string> = {
  beacon: "transmission beacon",
  construct: "arsenal construct",
  core: "intelligence core",
  dossier: "classified dossier",
  scanner: "identity lattice",
  vault: "neural vault",
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

const ChargeTrigger = ({
  ambient,
  bind,
  holdProgress,
  label,
}: {
  ambient: MissionNode["ambient"];
  bind: HoldInteractionBind;
  holdProgress: number;
  label: string;
}) => (
  <button
    className="hold-control group relative mt-8 inline-flex w-full max-w-[24rem] items-center gap-4 overflow-hidden rounded-full border border-white/14 bg-white/[0.035] px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.24em] text-primary backdrop-blur-2xl transition duration-500 hover:border-white/35 sm:w-auto sm:min-w-[23rem]"
    style={{
      boxShadow: `0 0 ${18 + holdProgress * 56}px ${ambient.secondary}3d`,
    }}
    type="button"
    {...bind}
  >
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/18">
      <motion.span
        animate={{ rotate: holdProgress > 0 ? 280 : 360 }}
        className="absolute inset-2 rounded-full border border-dashed border-white/45"
        transition={{ duration: holdProgress > 0 ? 1 : 8, ease: "linear", repeat: Infinity }}
      />
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
        <motion.circle
          animate={{ pathLength: holdProgress }}
          cx="24"
          cy="24"
          fill="none"
          r="21"
          stroke={ambient.alert}
          strokeLinecap="round"
          strokeWidth="2"
          transition={{ duration: 0.18, ease: "linear" }}
        />
      </svg>
      <motion.span
        animate={{ scale: 1 + holdProgress * 1.25, opacity: 0.72 - holdProgress * 0.18 }}
        className="absolute h-3 w-3 rounded-full"
        style={{ background: ambient.alert }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
    </span>
    <span className="relative z-10 leading-5">{label}</span>
    <span className="ml-auto hidden font-mono text-[9px] text-white/42 sm:block">
      {Math.round(holdProgress * 100)}%
    </span>
    <motion.span
      className="absolute inset-y-0 left-0"
      style={{
        background: `linear-gradient(90deg, ${ambient.alert}22, ${ambient.secondary}12)`,
        width: `${holdProgress * 100}%`,
      }}
    />
  </button>
);

const CyberArtifact = ({ node }: { node: MissionNode }) => {
  const { activatedNode, intensity, sceneProgress, transitionProgress } = useEnvironment();
  const isActivated = activatedNode === node.id;
  const artifactClass = `artifact-${node.artifact}`;

  return (
    <motion.div
      animate={{
        opacity: 1,
        rotateX: 58 - transitionProgress * 10,
        rotateY: sceneProgress * 32 - 12,
        scale: isActivated ? 1.08 : 1 + transitionProgress * 0.05,
        y: Math.sin(sceneProgress * Math.PI) * -20,
      }}
      className="scene-artifact relative mx-auto flex aspect-square w-[min(82vw,34rem)] items-center justify-center"
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      transition={{ duration: 0.9, ease: premiumEase }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        className="artifact-ring absolute inset-0 rounded-full border border-dashed border-white/18"
        transition={{ duration: isActivated ? 18 : 34, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        animate={{ rotate: -360, scale: 1 + intensity * 0.08 }}
        className="artifact-ring absolute inset-[12%] rounded-full border border-white/12"
        transition={{ duration: isActivated ? 24 : 46, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        className="artifact-sweep absolute inset-[4%] rounded-full"
        transition={{ duration: isActivated ? 5 : 9, ease: "linear", repeat: Infinity }}
      />

      <motion.div
        animate={{
          boxShadow: `0 0 ${48 + intensity * 110}px ${node.ambient.secondary}66`,
          filter: `saturate(${1 + intensity * 0.45})`,
        }}
        className={`artifact-body ${artifactClass}`}
      >
        {Array.from({ length: node.artifact === "vault" ? 7 : 5 }, (_, index) => (
          <span
            className="artifact-strut"
            key={`${node.id}-strut-${index}`}
            style={{ rotate: `${index * (360 / 5)}deg` }}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/48 backdrop-blur-xl">
        <Zap size={12} />
        {artifactLabels[node.artifact]}
      </div>
    </motion.div>
  );
};

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
              <p className="mt-7 max-w-2xl font-body text-base leading-8 text-secondary sm:text-lg">
                {node.dek}
              </p>
            </motion.div>

            <InteractionController key={node.id} node={node} onNarration={onNarration}>
              {({ bind, holdProgress }) => (
                <ChargeTrigger
                  ambient={node.ambient}
                  bind={bind}
                  holdProgress={holdProgress}
                  label={node.holdLabel}
                />
              )}
            </InteractionController>
          </div>

          <div className="relative z-10 flex min-h-[28rem] items-center justify-center lg:min-h-[36rem]">
            <CyberArtifact node={node} />
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
