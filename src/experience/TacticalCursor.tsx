import { memo, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEnvironment } from "./EnvironmentProvider";

const TacticalCursorComponent = () => {
  const { focusedNode, intensity, mode } = useEnvironment();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { damping: 24, stiffness: 280 });
  const smoothY = useSpring(y, { damping: 24, stiffness: 280 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const update = () => setIsFinePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    document.documentElement.classList.add("tactical-cursor-enabled");
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      document.documentElement.classList.remove("tactical-cursor-enabled");
      window.removeEventListener("pointermove", move);
    };
  }, [isFinePointer, x, y]);

  if (!isFinePointer) return null;

  const color =
    mode === "breach" ? "rgba(251,113,133,0.9)" : mode === "intelligence" ? "rgba(183,255,42,0.9)" : "rgba(56,189,248,0.9)";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] h-16 w-16 -translate-x-1/2 -translate-y-1/2"
      style={{ x: smoothX, y: smoothY }}
    >
      <motion.div
        animate={{
          borderColor: color,
          boxShadow: `0 0 ${focusedNode ? 34 : 18}px ${color}`,
          scale: 1 + intensity * 0.28,
        }}
        className="absolute inset-0 rounded-full border"
      />
      <motion.div
        animate={{ rotate: focusedNode ? 180 : 360 }}
        className="absolute inset-3 rounded-full border border-dashed border-white/35"
        transition={{ duration: focusedNode ? 1.8 : 8, ease: "linear", repeat: Infinity }}
      />
      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/60" />
      <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white/60" />
      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/60" />
      <span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/60" />
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </motion.div>
  );
};

export const TacticalCursor = memo(TacticalCursorComponent);
