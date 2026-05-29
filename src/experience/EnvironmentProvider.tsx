import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { missionNodes } from "./missionContent";
import type { EnvironmentMode, MissionId } from "./types";

type EnvironmentState = {
  activeNode: MissionId;
  holdNode: MissionId | null;
  intensity: number;
  mode: EnvironmentMode;
  progress: number;
  reducedMotion: boolean;
  setActiveNode: (node: MissionId) => void;
  setHoldNode: (node: MissionId | null) => void;
  setIntensity: (intensity: number) => void;
  setMode: (mode: EnvironmentMode) => void;
  setProgress: (progress: number) => void;
};

const EnvironmentContext = createContext<EnvironmentState | null>(null);

const getInitialReducedMotion = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const EnvironmentProviderComponent = ({ children }: { children: ReactNode }) => {
  const [activeNode, setActiveNode] = useState<MissionId>(missionNodes[0].id);
  const [holdNode, setHoldNode] = useState<MissionId | null>(null);
  const [intensity, setRawIntensity] = useState(0);
  const [mode, setMode] = useState<EnvironmentMode>("idle");
  const [progress, setRawProgress] = useState(0);
  const [reducedMotion] = useState(getInitialReducedMotion);

  const setIntensity = useCallback((nextIntensity: number) => {
    setRawIntensity(Math.min(Math.max(nextIntensity, 0), 1));
  }, []);

  const setProgress = useCallback((nextProgress: number) => {
    setRawProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, []);

  const value = useMemo(
    () => ({
      activeNode,
      holdNode,
      intensity,
      mode,
      progress,
      reducedMotion,
      setActiveNode,
      setHoldNode,
      setIntensity,
      setMode,
      setProgress,
    }),
    [activeNode, holdNode, intensity, mode, progress, reducedMotion, setIntensity, setProgress],
  );

  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
};

export const EnvironmentProvider = memo(EnvironmentProviderComponent);

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error("useEnvironment must be used inside EnvironmentProvider");
  }

  return context;
};
