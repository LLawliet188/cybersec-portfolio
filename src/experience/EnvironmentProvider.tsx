import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { missionNodes } from "./missionContent";
import type { EnvironmentMode, MissionId } from "./types";

type EnvironmentState = {
  activationProgress: number;
  activationProgressRef: MutableRefObject<number>;
  activatedNode: MissionId | null;
  activeNode: MissionId;
  focusedNode: MissionId | null;
  intensity: number;
  intensityRef: MutableRefObject<number>;
  mode: EnvironmentMode;
  progress: number;
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
  sceneProgress: number;
  sceneProgressRef: MutableRefObject<number>;
  transitionProgress: number;
  transitionProgressRef: MutableRefObject<number>;
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

const getNow = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

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
  const activationProgressRef = useRef(0);
  const intensityRef = useRef(0);
  const progressRef = useRef(0);
  const sceneProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const activationUiRef = useRef({ time: 0, value: 0 });
  const intensityUiRef = useRef({ time: 0, value: 0 });
  const progressUiRef = useRef({ time: 0, value: 0 });
  const sceneProgressUiRef = useRef({ time: 0, value: 0 });
  const transitionProgressUiRef = useRef({ time: 0, value: 0 });

  const setIntensity = useCallback((nextIntensity: number) => {
    const clamped = Math.min(Math.max(nextIntensity, 0), 1);
    intensityRef.current = clamped;
    const now = getNow();
    const endpointChanged =
      (clamped === 0 || clamped === 1) && clamped !== intensityUiRef.current.value;
    const changed = Math.abs(clamped - intensityUiRef.current.value);
    const shouldSync =
      endpointChanged ||
      (changed > 0.0001 && (changed >= 0.035 || now - intensityUiRef.current.time > 90));

    if (!shouldSync) return;
    intensityUiRef.current = { time: now, value: clamped };
    setRawIntensity(clamped);
  }, []);

  const setActivationProgress = useCallback((nextProgress: number) => {
    const clamped = Math.min(Math.max(nextProgress, 0), 1);
    activationProgressRef.current = clamped;
    const now = getNow();
    const endpointChanged =
      (clamped === 0 || clamped === 1) && clamped !== activationUiRef.current.value;
    const changed = Math.abs(clamped - activationUiRef.current.value);
    const shouldSync =
      endpointChanged ||
      (changed > 0.0001 && (changed >= 0.03 || now - activationUiRef.current.time > 70));

    if (!shouldSync) return;
    activationUiRef.current = { time: now, value: clamped };
    setRawActivationProgress(clamped);
  }, []);

  const setProgress = useCallback((nextProgress: number) => {
    const clamped = Math.min(Math.max(nextProgress, 0), 1);
    progressRef.current = clamped;
    const now = getNow();
    const endpointChanged =
      (clamped === 0 || clamped === 1) && clamped !== progressUiRef.current.value;
    const changed = Math.abs(clamped - progressUiRef.current.value);
    const shouldSync =
      endpointChanged ||
      (changed > 0.0001 && (changed >= 0.006 || now - progressUiRef.current.time > 90));

    if (!shouldSync) return;
    progressUiRef.current = { time: now, value: clamped };
    setRawProgress(clamped);
  }, []);

  const setSceneProgress = useCallback((nextProgress: number) => {
    const clamped = Math.min(Math.max(nextProgress, 0), 1);
    sceneProgressRef.current = clamped;
    const now = getNow();
    const endpointChanged =
      (clamped === 0 || clamped === 1) && clamped !== sceneProgressUiRef.current.value;
    const changed = Math.abs(clamped - sceneProgressUiRef.current.value);
    const shouldSync =
      endpointChanged ||
      (changed > 0.0001 && (changed >= 0.012 || now - sceneProgressUiRef.current.time > 80));

    if (!shouldSync) return;
    sceneProgressUiRef.current = { time: now, value: clamped };
    setRawSceneProgress(clamped);
  }, []);

  const setTransitionProgress = useCallback((nextProgress: number) => {
    const clamped = Math.min(Math.max(nextProgress, 0), 1);
    transitionProgressRef.current = clamped;
    const now = getNow();
    const endpointChanged =
      (clamped === 0 || clamped === 1) && clamped !== transitionProgressUiRef.current.value;
    const changed = Math.abs(clamped - transitionProgressUiRef.current.value);
    const shouldSync =
      endpointChanged ||
      (changed > 0.0001 && (changed >= 0.018 || now - transitionProgressUiRef.current.time > 90));

    if (!shouldSync) return;
    transitionProgressUiRef.current = { time: now, value: clamped };
    setRawTransitionProgress(clamped);
  }, []);

  const value = useMemo(
    () => ({
      activationProgress,
      activationProgressRef,
      activatedNode,
      activeNode,
      focusedNode,
      intensity,
      intensityRef,
      mode,
      progress,
      progressRef,
      reducedMotion,
      sceneProgress,
      sceneProgressRef,
      transitionProgress,
      transitionProgressRef,
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
