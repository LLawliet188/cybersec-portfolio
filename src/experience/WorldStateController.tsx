import { memo, useEffect } from "react";
import Lenis from "lenis";
import { missionNodes } from "./missionContent";
import { useEnvironment } from "./EnvironmentProvider";

const WorldStateControllerComponent = () => {
  const {
    activatedNode,
    focusedNode,
    reducedMotion,
    setActiveNode,
    setMode,
    setProgress,
    setSceneProgress,
    setTransitionProgress,
  } = useEnvironment();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (value: number) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
      wheelMultiplier: 0.78,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let frameId = 0;

    const updateWorldState = () => {
      const maxScroll =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setProgress(progress);

      const scaledProgress = progress * (missionNodes.length - 1);
      const nextIndex = Math.min(
        missionNodes.length - 1,
        Math.max(0, Math.round(scaledProgress)),
      );
      const segmentIndex = Math.min(
        missionNodes.length - 2,
        Math.max(0, Math.floor(scaledProgress)),
      );
      const localProgress = scaledProgress - segmentIndex;
      const transitionPressure = Math.sin(Math.min(Math.max(localProgress, 0), 1) * Math.PI);
      const closestId = missionNodes[nextIndex].id;

      setActiveNode(closestId);
      setSceneProgress(Math.min(Math.max(localProgress, 0), 1));
      setTransitionProgress(transitionPressure);

      if (!focusedNode && activatedNode !== closestId) {
        if (closestId === "operations") setMode("breach");
        else if (closestId === "boot") setMode("idle");
        else setMode("scan");
      }
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        updateWorldState();
        frameId = 0;
      });
    };

    updateWorldState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [
    activatedNode,
    focusedNode,
    setActiveNode,
    setMode,
    setProgress,
    setSceneProgress,
    setTransitionProgress,
  ]);

  return null;
};

export const WorldStateController = memo(WorldStateControllerComponent);
