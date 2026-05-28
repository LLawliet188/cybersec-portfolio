import { memo, useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type GhostCursorProps = {
  className?: string;
};

type TrailPoint = {
  position: Vector2;
  bornAt: number;
};

const MAX_POINTS = 32;
const TRAIL_LIFETIME = 1450;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

#define MAX_POINTS 32

uniform vec2 uResolution;
uniform vec3 uPoints[MAX_POINTS];
uniform int uPointCount;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 41.21);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float smoke = 0.0;
  float core = 0.0;

  for (int i = 0; i < MAX_POINTS; i++) {
    if (i >= uPointCount) {
      break;
    }

    vec3 point = uPoints[i];
    vec2 delta = vUv - point.xy;
    delta.x *= aspect;

    float distanceToPoint = length(delta);
    float life = point.z;
    float angle = atan(delta.y, delta.x);
    float turbulence = noise(vUv * 9.0 + vec2(uTime * 0.08, life * 3.0));
    float spiral = sin(angle * 7.0 + distanceToPoint * 28.0 - uTime * 1.6);

    float smokyFalloff = exp(-distanceToPoint * distanceToPoint * 34.0);
    float hotFalloff = exp(-distanceToPoint * distanceToPoint * 160.0);

    smoke += smokyFalloff * life * mix(0.68, 1.18, turbulence + spiral * 0.08);
    core += hotFalloff * life;
  }

  float signal = clamp(smoke * 0.42 + core * 0.68, 0.0, 1.0);
  vec3 color = mix(uColorB, uColorA, clamp(core + signal * 0.45, 0.0, 1.0));
  float alpha = smoothstep(0.02, 0.88, signal) * uOpacity;

  gl_FragColor = vec4(color * signal, alpha);
}
`;

const createEmptyPointUniforms = () =>
  Array.from({ length: MAX_POINTS }, () => new Vector3(-10, -10, 0));

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const GhostCursorComponent = ({ className = "" }: GhostCursorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const compactViewport = window.innerWidth < 768;

    if (prefersReducedMotion || compactViewport || !isWebGLAvailable()) {
      setShowFallback(true);
      return;
    }

    setShowFallback(false);

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));

    const canvas = renderer.domElement;
    canvas.className = "h-full w-full";
    container.appendChild(canvas);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const pointUniforms = createEmptyPointUniforms();

    const material = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new Vector2(1, 1) },
        uPoints: { value: pointUniforms },
        uPointCount: { value: 0 },
        uTime: { value: 0 },
        uColorA: { value: new Color("#00C8FF") },
        uColorB: { value: new Color("#7C3AED") },
        uOpacity: { value: 0.5 },
      },
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    const bloomPass = new UnrealBloomPass(new Vector2(1, 1), 0.28, 0.34, 0.2);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    const trailPoints: TrailPoint[] = [];
    let frameId = 0;
    let lastPoint = new Vector2(0.5, 0.5);
    let hasPointer = false;
    const startedAt = performance.now();

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    const addTrailPoint = (position: Vector2) => {
      const movedFarEnough = !hasPointer || position.distanceTo(lastPoint) > 0.01;
      if (!movedFarEnough) return;

      hasPointer = true;
      lastPoint = position.clone();
      trailPoints.push({ position: position.clone(), bornAt: performance.now() });

      if (trailPoints.length > MAX_POINTS) {
        trailPoints.splice(0, trailPoints.length - MAX_POINTS);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;

      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      addTrailPoint(new Vector2(x, y));
    };

    const render = () => {
      const now = performance.now();
      material.uniforms.uTime.value = (now - startedAt) / 1000;

      for (let index = trailPoints.length - 1; index >= 0; index -= 1) {
        if (now - trailPoints[index].bornAt > TRAIL_LIFETIME) {
          trailPoints.splice(index, 1);
        }
      }

      trailPoints.forEach((point, index) => {
        const life = 1 - (now - point.bornAt) / TRAIL_LIFETIME;
        pointUniforms[index].set(point.position.x, point.position.y, life);
      });

      for (let index = trailPoints.length; index < MAX_POINTS; index += 1) {
        pointUniforms[index].set(-10, -10, 0);
      }

      material.uniforms.uPointCount.value = trailPoints.length;
      composer.render();
      frameId = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    resize();
    render();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      // PERF: GhostCursor owns a Three.js RAF loop, ResizeObserver, renderer, and postprocessing chain; all are disposed on unmount.
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      composer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen ${className}`}
      data-effect="ghost-cursor"
      ref={containerRef}
    >
      {showFallback ? (
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />
      ) : null}
    </div>
  );
};

export const GhostCursor = memo(GhostCursorComponent);
