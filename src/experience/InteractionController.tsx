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
  const { setHoldNode, setIntensity, setMode } = useEnvironment();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const progressRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const startHold = useCallback(() => {
    window.cyberAudio?.playInterface("hold");
    tweenRef.current?.kill();
    setHoldNode(node.id);
    setMode(node.id === "operations" ? "breach" : "intelligence");
    onNarration(node);

    tweenRef.current = gsap.to(progressRef.current, {
      duration: 1.2,
      ease: "power3.out",
      value: 1,
      onUpdate: () => {
        setHoldProgress(progressRef.current.value);
        setIntensity(progressRef.current.value);
      },
      onComplete: () => setIsDecrypted(true),
    });
  }, [node, onNarration, setHoldNode, setIntensity, setMode]);

  const endHold = useCallback(() => {
    tweenRef.current?.kill();
    setHoldNode(null);
    onNarration(null);

    tweenRef.current = gsap.to(progressRef.current, {
      duration: 0.85,
      ease: "power2.out",
      value: 0,
      onUpdate: () => {
        setHoldProgress(progressRef.current.value);
        setIntensity(progressRef.current.value);
      },
      onComplete: () => setMode("scan"),
    });
  }, [onNarration, setHoldNode, setIntensity, setMode]);

  const startPointerHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
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
