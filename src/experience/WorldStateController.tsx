import { memo, useEffect } from "react";
import Lenis from "lenis";
import { missionNodes } from "./missionContent";
import { useEnvironment } from "./EnvironmentProvider";

const WorldStateControllerComponent = () => {
  const { holdNode, reducedMotion, setActiveNode, setMode, setProgress } = useEnvironment();

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

      let closestId = missionNodes[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      missionNodes.forEach((node) => {
        const element = document.querySelector(`[data-mission-node="${node.id}"]`);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.42 - window.innerHeight * 0.5);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = node.id;
        }
      });

      setActiveNode(closestId);
      if (!holdNode) {
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
  }, [holdNode, setActiveNode, setMode, setProgress]);

  return null;
};

export const WorldStateController = memo(WorldStateControllerComponent);
