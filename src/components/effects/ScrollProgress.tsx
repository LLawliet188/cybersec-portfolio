import { memo } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";

const ScrollProgressComponent = () => {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-0.5 bg-cta-gradient shadow-cyan-sm"
      style={{ width: `${progress}%` }}
    />
  );
};

export const ScrollProgress = memo(ScrollProgressComponent);
