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
  activationProgress: number;
  activatedNode: MissionId | null;
  activeNode: MissionId;
  focusedNode: MissionId | null;
  intensity: number;
  mode: EnvironmentMode;
  progress: number;
  reducedMotion: boolean;
  sceneProgress: number;
  transitionProgress: number;
  setActivationProgress: (progress: number) => void;
  setActivatedNode: (node: MissionId | null) => void;
  setActiveNode: (node: MissionId) => void;
  setFocusedNode: (node: MissionId | null) => void;
  setIntensity: (intensity: number) => void;
  setMode: (mode: EnvironmentMode) => void;
  setProgress: (progress: number) => void;
  setSceneProgress: (progress: number) => void;
  setTransitionProgress: (progress: number) => void;
};

const EnvironmentContext = createContext<EnvironmentState | null>(null);

const getInitialReducedMotion = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const EnvironmentProviderComponent = ({ children }: { children: ReactNode }) => {
  const [activationProgress, setRawActivationProgress] = useState(0);
  const [activeNode, setActiveNode] = useState<MissionId>(missionNodes[0].id);
  const [activatedNode, setActivatedNode] = useState<MissionId | null>(null);
  const [focusedNode, setFocusedNode] = useState<MissionId | null>(null);
  const [intensity, setRawIntensity] = useState(0);
  const [mode, setMode] = useState<EnvironmentMode>("idle");
  const [progress, setRawProgress] = useState(0);
  const [sceneProgress, setRawSceneProgress] = useState(0);
  const [transitionProgress, setRawTransitionProgress] = useState(0);
  const [reducedMotion] = useState(getInitialReducedMotion);

  const setIntensity = useCallback((nextIntensity: number) => {
    setRawIntensity(Math.min(Math.max(nextIntensity, 0), 1));
  }, []);

  const setActivationProgress = useCallback((nextProgress: number) => {
    setRawActivationProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, []);

  const setProgress = useCallback((nextProgress: number) => {
    setRawProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, []);

  const setSceneProgress = useCallback((nextProgress: number) => {
    setRawSceneProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, []);

  const setTransitionProgress = useCallback((nextProgress: number) => {
    setRawTransitionProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, []);

  const value = useMemo(
    () => ({
      activationProgress,
      activatedNode,
      activeNode,
      focusedNode,
      intensity,
      mode,
      progress,
      reducedMotion,
      sceneProgress,
      transitionProgress,
      setActivationProgress,
      setActivatedNode,
      setActiveNode,
      setFocusedNode,
      setIntensity,
      setMode,
      setProgress,
      setSceneProgress,
      setTransitionProgress,
    }),
    [
      activationProgress,
      activatedNode,
      activeNode,
      focusedNode,
      intensity,
      mode,
      progress,
      reducedMotion,
      sceneProgress,
      transitionProgress,
      setActivationProgress,
      setIntensity,
      setProgress,
      setSceneProgress,
      setTransitionProgress,
    ],
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
