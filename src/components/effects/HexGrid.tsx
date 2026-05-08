import { memo } from "react";

type HexGridProps = {
  className?: string;
};

const HexGridComponent = ({ className = "" }: HexGridProps) => {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
    >
      <defs>
        <pattern
          id="angled-hex-grid"
          width="96"
          height="56"
          patternTransform="rotate(-12)"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 1H72L95 28L72 55H24L1 28L24 1Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect fill="url(#angled-hex-grid)" height="100%" width="100%" />
    </svg>
  );
};

export const HexGrid = memo(HexGridComponent);
