import { memo, useMemo, useRef, type CSSProperties } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Database,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { GithubMark, LinkedinMark } from "../components/social/SocialIcons";
import { PROJECTS, SITE, SKILL_GROUPS } from "../content/siteContent";
import { premiumEase } from "../utils/animation";
import { useEnvironment } from "./EnvironmentProvider";
import { InteractionController, type HoldInteractionBind } from "./InteractionController";
import type { MissionNode } from "./types";

type MissionNodeViewProps = {
  node: MissionNode;
  onNarration: (node: MissionNode | null) => void;
};

const getNodeIcon = (nodeId: MissionNode["id"]) => {
  if (nodeId === "arsenal") return Database;
  if (nodeId === "operations") return ShieldCheck;
  if (nodeId === "file") return FileText;
  if (nodeId === "transmission") return Mail;
  return ShieldCheck;
};

const HoldTrigger = ({
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
    className="hold-control group relative mt-10 inline-flex w-full max-w-[22rem] items-center gap-4 overflow-hidden rounded-full border border-white/14 bg-white/[0.035] px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.24em] text-primary backdrop-blur-2xl transition duration-500 hover:border-white/35 sm:w-auto sm:min-w-[21rem]"
    style={{
      boxShadow: `0 0 ${holdProgress * 42}px ${ambient.secondary}55`,
    }}
    type="button"
    {...bind}
  >
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/18">
      <motion.span
        animate={{ rotate: holdProgress > 0 ? 240 : 360 }}
        className="absolute inset-2 rounded-full border border-dashed border-white/45"
        transition={{ duration: holdProgress > 0 ? 1.2 : 8, ease: "linear", repeat: Infinity }}
      />
      <motion.span
        animate={{ scale: 1 + holdProgress * 1.8, opacity: 0.7 - holdProgress * 0.25 }}
        className="absolute h-3 w-3 rounded-full"
        style={{ background: ambient.alert }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
    </span>
    <span className="relative z-10 leading-5">{label}</span>
    <motion.span
      className="absolute inset-y-0 left-0"
      style={{
        background: `linear-gradient(90deg, ${ambient.alert}22, ${ambient.secondary}11)`,
        width: `${holdProgress * 100}%`,
      }}
    />
  </button>
);

const IntelligenceRows = ({ node }: { node: MissionNode }) => (
  <div className="mt-8 grid gap-2">
    {node.intel.map((item, index) => (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="intel-row grid gap-2 border-l border-white/16 bg-white/[0.025] py-3 pl-4 pr-3 sm:grid-cols-[0.32fr_0.68fr]"
        initial={{ opacity: 0, x: -18 }}
        key={`${node.id}-${item.label}`}
        transition={{ delay: index * 0.08, duration: 0.55, ease: premiumEase }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/48">
          {item.label}
        </span>
        <span className="font-body text-sm font-semibold text-primary/92">{item.value}</span>
      </motion.div>
    ))}
  </div>
);

const ArsenalDeepData = () => (
  <div className="mt-8 grid gap-3 sm:grid-cols-2">
    {SKILL_GROUPS.map((group, index) => (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="intel-plane p-4"
        initial={{ opacity: 0, y: 18 }}
        key={group.label}
        transition={{ delay: index * 0.08, duration: 0.55, ease: premiumEase }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/44">
          {group.signal}
        </p>
        <p className="mt-2 font-display text-lg font-bold uppercase text-primary">
          {group.label}
        </p>
        <p className="mt-2 font-body text-sm leading-6 text-secondary">{group.summary}</p>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/56">
          {group.skills.map((skill) => skill.name).join(" / ")}
        </p>
      </motion.div>
    ))}
  </div>
);

const OperationsDeepData = () => (
  <div className="mt-8 space-y-4">
    {PROJECTS.map((project, index) => (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="intel-plane p-4"
        initial={{ opacity: 0, y: 18 }}
        key={project.title}
        transition={{ delay: index * 0.08, duration: 0.55, ease: premiumEase }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/46">
            {project.codename}
          </p>
          <span className="rounded-full border border-white/14 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/58">
            {project.status} / {project.severity}
          </span>
        </div>
        <p className="mt-3 font-display text-xl font-bold uppercase text-primary">
          {project.title}
        </p>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-secondary">
          {project.outcome}
        </p>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/56">
          {project.stack.join(" / ")}
        </p>
      </motion.div>
    ))}
  </div>
);

const FileDeepData = () => (
  <div className="mt-8 flex flex-wrap gap-3">
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-3 font-body text-sm font-bold text-primary transition hover:border-white/40"
      href={SITE.links.resume}
    >
      <FileText size={16} />
      Request Resume
    </a>
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-3 font-body text-sm font-bold text-primary transition hover:border-white/40"
      href={`mailto:${SITE.email}?subject=Cybersecurity%20Internship%20Opportunity`}
    >
      <Mail size={16} />
      Internship Signal
    </a>
  </div>
);

const TransmissionLinks = () => (
  <div className="mt-8 flex flex-wrap gap-3">
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-3 font-body text-sm font-bold text-primary transition hover:border-white/40"
      href={SITE.links.email}
    >
      <Mail size={16} />
      Email
    </a>
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-3 font-body text-sm font-bold text-primary transition hover:border-white/40"
      href={SITE.links.linkedin}
      rel="noreferrer"
      target="_blank"
    >
      <LinkedinMark size={16} />
      LinkedIn
    </a>
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-3 font-body text-sm font-bold text-primary transition hover:border-white/40"
      href={SITE.links.github}
      rel="noreferrer"
      target="_blank"
    >
      <GithubMark size={16} />
      GitHub
    </a>
  </div>
);

const DecryptedData = ({ node }: { node: MissionNode }) => {
  if (node.id === "arsenal") return <ArsenalDeepData />;
  if (node.id === "operations") return <OperationsDeepData />;
  if (node.id === "file") {
    return (
      <>
        <IntelligenceRows node={node} />
        <FileDeepData />
      </>
    );
  }
  if (node.id === "transmission") {
    return (
      <>
        <IntelligenceRows node={node} />
        <TransmissionLinks />
      </>
    );
  }

  return <IntelligenceRows node={node} />;
};

const SignalMonolith = ({ node }: { node: MissionNode }) => {
  const Icon = getNodeIcon(node.id);

  return (
    <motion.aside
      className="relative hidden min-h-[33rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/[0.18] p-6 shadow-panel-depth backdrop-blur-xl lg:block"
      initial={{ opacity: 0, x: 42, rotateY: -8 }}
      transition={{ duration: 0.9, ease: premiumEase }}
      viewport={{ amount: 0.5, once: false }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
    >
      <div
        className="absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(circle at 48% 24%, ${node.ambient.secondary}55, transparent 17rem), linear-gradient(145deg, ${node.ambient.primary}22, transparent 52%)`,
        }}
      />
      <div className="absolute inset-0 scanline-mask opacity-20" />
      <motion.div
        animate={{ rotate: 360 }}
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-dashed border-white/12"
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/48">
            Live intelligence stream
          </p>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] text-primary">
            <Icon size={18} />
          </span>
        </div>

        <div className="mt-12 space-y-5">
          {node.signal.map((signal, index) => (
            <motion.div
              animate={{ opacity: [0.38, 1, 0.38], x: [0, 8, 0] }}
              className="border-l border-white/14 pl-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/68"
              key={signal}
              transition={{
                delay: index * 0.28,
                duration: 3.4 + index * 0.35,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              {signal}
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-0 right-0 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/36">
          <span>Signal routed</span>
          <ArrowUpRight size={13} />
        </div>
      </div>
    </motion.aside>
  );
};

const MissionNodeViewComponent = ({ node, onNarration }: MissionNodeViewProps) => {
  const { activeNode, intensity } = useEnvironment();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.34, margin: "-10% 0px -10% 0px" });
  const isActive = activeNode === node.id;

  const nodeStyle = useMemo(
    () => ({
      "--node-primary": node.ambient.primary,
      "--node-secondary": node.ambient.secondary,
      "--node-alert": node.ambient.alert,
    }) as CSSProperties,
    [node.ambient.alert, node.ambient.primary, node.ambient.secondary],
  );

  return (
    <article
      className="mission-node relative flex min-h-[124vh] items-center px-5 py-32 sm:px-8"
      data-mission-node={node.id}
      id={`mission-${node.id}`}
      ref={ref}
      style={nodeStyle}
    >
      <motion.div
        animate={{
          opacity: isActive ? 0.55 + intensity * 0.22 : 0.16,
          scale: isActive ? 1 : 0.92,
        }}
        className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
        transition={{ duration: 0.9, ease: premiumEase }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.56fr_0.44fr]">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.32, y: 36 }}
          transition={{ duration: 0.9, ease: premiumEase }}
        >
          <span className="phase-chip inline-flex rounded-full px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.24em]">
            Phase {node.phase}
          </span>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">
            {node.label}
          </p>
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold uppercase leading-[0.92] text-primary sm:text-6xl lg:text-7xl">
            {node.title}
          </h1>
          <p className="mt-7 max-w-2xl font-body text-base leading-8 text-secondary sm:text-lg">
            {node.dek}
          </p>

          <InteractionController node={node} onNarration={onNarration}>
            {({ bind, holdProgress, isDecrypted }) => (
              <>
                <HoldTrigger
                  ambient={node.ambient}
                  bind={bind}
                  holdProgress={holdProgress}
                  label={node.holdLabel}
                />
                <AnimatePresence>
                  {isDecrypted ? (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl"
                      exit={{ opacity: 0, y: 12 }}
                      initial={{ opacity: 0, y: 18 }}
                      transition={{ duration: 0.65, ease: premiumEase }}
                    >
                      <DecryptedData node={node} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </InteractionController>
        </motion.div>

        <SignalMonolith node={node} />
      </div>
    </article>
  );
};

export const MissionNodeView = memo(MissionNodeViewComponent);
