import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useEnvironment } from "./EnvironmentProvider";
import type { MissionNode } from "./types";

const activationThreshold = 0.72;
const minimumHoldMs = 680;
const chargeDuration = 0.95;

type InteractionControllerProps = {
  children: (state: {
    holdProgress: number;
    isDecrypted: boolean;
    bind: HoldInteractionBind;
  }) => ReactNode;
  node: MissionNode;
  onNarration: (node: MissionNode | null) => void;
};

export type HoldInteractionBind = {
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onPointerCancel: () => void;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onPointerUp: () => void;
};

const InteractionControllerComponent = ({
  children,
  node,
  onNarration,
}: InteractionControllerProps) => {
  const { setActivatedNode, setHoldNode, setIntensity, setMode } = useEnvironment();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const progressRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoldingRef = useRef(false);
  const holdStartedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    tweenRef.current?.kill();
    progressRef.current.value = 0;
    isHoldingRef.current = false;
    holdStartedAtRef.current = 0;
    setHoldProgress(0);
    setIsDecrypted(false);
  }, [node.id]);

  const startHold = useCallback(() => {
    isHoldingRef.current = true;
    holdStartedAtRef.current = window.performance.now();
    window.cyberAudio?.playInterface("hold");
    tweenRef.current?.kill();
    setHoldNode(node.id);
    setMode("scan");
    setIsDecrypted(false);
    onNarration(null);

    tweenRef.current = gsap.to(progressRef.current, {
      duration: chargeDuration,
      ease: "power3.out",
      value: 1,
      onUpdate: () => {
        setHoldProgress(progressRef.current.value);
        setIntensity(progressRef.current.value * 0.72);
      },
    });
  }, [node.id, onNarration, setHoldNode, setIntensity, setMode]);

  const endHold = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    tweenRef.current?.kill();
    setHoldNode(null);
    const elapsed = window.performance.now() - holdStartedAtRef.current;
    const shouldActivate =
      progressRef.current.value >= activationThreshold || elapsed >= minimumHoldMs;

    if (shouldActivate) {
      window.cyberAudio?.playInterface("unlock");
      setActivatedNode(node.id);
      setIsDecrypted(true);
      setMode(node.id === "operations" ? "breach" : "intelligence");
      setIntensity(1);
      onNarration(node);

      tweenRef.current = gsap.to(progressRef.current, {
        duration: 0.52,
        ease: "power2.out",
        value: 1,
        onUpdate: () => setHoldProgress(progressRef.current.value),
      });
      return;
    }

    window.cyberAudio?.playInterface("cancel");
    onNarration(null);

    tweenRef.current = gsap.to(progressRef.current, {
      duration: 0.48,
      ease: "power2.out",
      value: 0,
      onUpdate: () => {
        setHoldProgress(progressRef.current.value);
        setIntensity(progressRef.current.value);
      },
      onComplete: () => setMode("scan"),
    });
  }, [node, onNarration, setActivatedNode, setHoldNode, setIntensity, setMode]);

  const startPointerHold = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    startHold();
  };

  const startKeyboardHold = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    startHold();
  };

  const endKeyboardHold = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    endHold();
  };

  return (
    <motion.div
      animate={{
        filter: holdProgress > 0 ? `saturate(${1 + holdProgress * 0.5})` : "saturate(1)",
      }}
    >
      {children({
        holdProgress,
        isDecrypted,
        bind: {
          onKeyDown: startKeyboardHold,
          onKeyUp: endKeyboardHold,
          onPointerCancel: endHold,
          onPointerDown: startPointerHold,
          onPointerEnter: () => window.cyberAudio?.playInterface("hover"),
          onPointerLeave: endHold,
          onPointerUp: endHold,
        },
      })}
    </motion.div>
  );
};

export const InteractionController = memo(InteractionControllerComponent);
