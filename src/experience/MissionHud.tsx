import { memo } from "react";
import { motion } from "framer-motion";
import { Headphones, Power, Volume2, VolumeX } from "lucide-react";
import { SITE } from "../content/siteContent";
import { premiumEase } from "../utils/animation";
import { useEnvironment } from "./EnvironmentProvider";
import { missionNodes } from "./missionContent";

type MissionHudProps = {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  volume: number;
};

const MissionHudComponent = ({
  audioEnabled,
  setAudioEnabled,
  setVolume,
  volume,
}: MissionHudProps) => {
  const { activeNode, focusedNode, mode, progress } = useEnvironment();
  const activeIndex = missionNodes.findIndex((node) => node.id === activeNode);
  const active = missionNodes[activeIndex] ?? missionNodes[0];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-7">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-start gap-3">
        <a
          className="pointer-events-auto group flex w-fit items-center gap-3"
          href="#mission-boot"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/[0.035] text-primary backdrop-blur-xl transition group-hover:border-white/35">
            <Power size={16} />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
              {SITE.githubHandle}
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-white/42">
              Cyber Intelligence OS
            </span>
          </span>
        </a>

        <div className="hidden min-w-[22rem] rounded-full border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl md:block">
          <div className="flex items-center justify-between gap-3">
            {missionNodes.map((node, index) => (
              <a
                aria-label={`Jump to phase ${node.phase}`}
                className="pointer-events-auto relative h-2.5 flex-1 rounded-full bg-white/[0.08]"
                href={`#mission-${node.id}`}
                key={node.id}
              >
                <motion.span
                  animate={{
                    opacity: activeIndex >= index ? 1 : 0.22,
                    scaleX: activeIndex >= index ? 1 : 0.2,
                  }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white"
                  style={{
                    background:
                      activeNode === node.id
                        ? `linear-gradient(90deg, ${active.ambient.alert}, ${active.ambient.secondary})`
                        : "rgba(255,255,255,0.32)",
                  }}
                  transition={{ duration: 0.65, ease: premiumEase }}
                />
              </a>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
            <span>Phase {active.phase}</span>
            <span>{active.label}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        <div className="justify-self-end">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              aria-label={audioEnabled ? "Mute cinematic audio" : "Activate cinematic audio"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] text-primary backdrop-blur-xl transition hover:border-white/35"
              onClick={() => setAudioEnabled(!audioEnabled)}
              type="button"
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/58 backdrop-blur-xl sm:flex">
              <Headphones size={13} />
              <span>{focusedNode ? "object focus" : mode}</span>
            </div>
            <label className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-3 py-2 backdrop-blur-xl lg:flex">
              <span className="sr-only">Cinematic audio volume</span>
              <input
                aria-label="Cinematic audio volume"
                className="h-1 w-20 accent-success"
                max="1"
                min="0"
                onChange={(event) => setVolume(Number(event.target.value))}
                step="0.01"
                type="range"
                value={volume}
              />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export const MissionHud = memo(MissionHudComponent);
