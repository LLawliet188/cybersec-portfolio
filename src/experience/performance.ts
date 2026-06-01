export type RenderQuality = "high" | "medium" | "low";

export type RenderQualitySettings = {
  antialias: boolean;
  dpr: [number, number];
  environmentPreset: boolean;
  galaxyParticleScale: number;
  microDetailScale: number;
  particleScale: number;
  ringSegments: number;
  sparkleActive: number;
  sparkleIdle: number;
  starCount: number;
  trailSegments: number;
  visibleNeighborRange: number;
};

export const renderQualitySettings: Record<RenderQuality, RenderQualitySettings> = {
  high: {
    antialias: true,
    dpr: [0.9, 1.15],
    environmentPreset: true,
    galaxyParticleScale: 0.72,
    microDetailScale: 0.72,
    particleScale: 0.78,
    ringSegments: 96,
    sparkleActive: 84,
    sparkleIdle: 24,
    starCount: 900,
    trailSegments: 128,
    visibleNeighborRange: 0,
  },
  medium: {
    antialias: false,
    dpr: [0.75, 1],
    environmentPreset: true,
    galaxyParticleScale: 0.48,
    microDetailScale: 0.52,
    particleScale: 0.58,
    ringSegments: 88,
    sparkleActive: 54,
    sparkleIdle: 14,
    starCount: 560,
    trailSegments: 96,
    visibleNeighborRange: 0,
  },
  low: {
    antialias: false,
    dpr: [0.62, 0.82],
    environmentPreset: false,
    galaxyParticleScale: 0.24,
    microDetailScale: 0.34,
    particleScale: 0.34,
    ringSegments: 64,
    sparkleActive: 28,
    sparkleIdle: 8,
    starCount: 240,
    trailSegments: 64,
    visibleNeighborRange: 0,
  },
};

export const detectRenderQuality = (): RenderQuality => {
  if (typeof window === "undefined") return "medium";

  const queryQuality = new URLSearchParams(window.location.search).get("quality");
  if (queryQuality === "high" || queryQuality === "medium" || queryQuality === "low") {
    return queryQuality;
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = window.navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const highDpr = window.devicePixelRatio > 1.7;

  if (prefersReducedMotion || isMobile || cores <= 4 || memory <= 4) return "low";
  if (cores <= 8 || memory <= 8 || highDpr) return "medium";
  return "high";
};

export const shouldShowPerformanceDebug = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "perf";
