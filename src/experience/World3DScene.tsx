import { memo, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  ShaderMaterial,
  Vector3,
  type MeshStandardMaterial,
  type Points,
} from "three";
import { useEnvironment } from "./EnvironmentProvider";
import { missionNodes } from "./missionContent";
import {
  detectRenderQuality,
  renderQualitySettings,
  shouldShowPerformanceDebug,
  type RenderQuality,
} from "./performance";
import type { MissionId, MissionNode } from "./types";

type World3DSceneProps = {
  onNarration: (node: MissionNode | null) => void;
};

type ArtifactRenderProps = {
  activationProgress: number;
  active: boolean;
  node: MissionNode;
  quality: RenderQuality;
  revealed: boolean;
  hovered: boolean;
};

type SceneWorldProfile = {
  architecture: "chamber" | "reactor" | "matrix" | "vault" | "monolith" | "relay";
  dust: string;
  horizon: string;
  nebula: [string, string, string];
  planet: string;
  rim: string;
  solar: string;
  shadow: string;
};

const HOLD_THRESHOLD_MS = 880;

const sceneWorldProfiles: Record<MissionId, SceneWorldProfile> = {
  arsenal: {
    architecture: "matrix",
    dust: "#E879F9",
    horizon: "#A855F7",
    nebula: ["#19072F", "#8B5CF6", "#F0ABFC"],
    planet: "#2E1065",
    rim: "#FDE68A",
    solar: "#FBBF24",
    shadow: "#05020B",
  },
  boot: {
    architecture: "chamber",
    dust: "#7DD3FC",
    horizon: "#38BDF8",
    nebula: ["#08112E", "#2563EB", "#C7D2FE"],
    planet: "#0F1B3D",
    rim: "#E5E7EB",
    solar: "#FACC15",
    shadow: "#030712",
  },
  file: {
    architecture: "monolith",
    dust: "#DDD6FE",
    horizon: "#A78BFA",
    nebula: ["#111827", "#7C3AED", "#F8FAFC"],
    planet: "#1E1B4B",
    rim: "#F8FAFC",
    solar: "#FDE68A",
    shadow: "#070A12",
  },
  identity: {
    architecture: "reactor",
    dust: "#67E8F9",
    horizon: "#00C8FF",
    nebula: ["#041224", "#0284C7", "#E0F2FE"],
    planet: "#082F49",
    rim: "#E2E8F0",
    solar: "#FDE68A",
    shadow: "#020817",
  },
  operations: {
    architecture: "vault",
    dust: "#FDBA74",
    horizon: "#F97316",
    nebula: ["#18070A", "#DC2626", "#FDBA74"],
    planet: "#451A03",
    rim: "#FED7AA",
    solar: "#F59E0B",
    shadow: "#100206",
  },
  transmission: {
    architecture: "relay",
    dust: "#A7F3D0",
    horizon: "#22D3EE",
    nebula: ["#03212B", "#06B6D4", "#FEF3C7"],
    planet: "#064E3B",
    rim: "#ECFEFF",
    solar: "#FDE68A",
    shadow: "#021014",
  },
};

const cameraPositions = [
  new Vector3(0.18, 0.52, 7.15),
  new Vector3(1.22, 0.18, 6.52),
  new Vector3(-1.1, 0.82, 6.0),
  new Vector3(1.38, -0.18, 5.55),
  new Vector3(-1.2, 0.56, 6.1),
  new Vector3(0.34, 0.24, 6.82),
];

const artifactPosition = new Vector3(1.16, -0.04, 0);
const mobileArtifactPosition = new Vector3(0, -1.18, 0);
const cameraFocus = new Vector3(0.52, -0.03, 0);
const cameraTargetVector = new Vector3();
const artifactOffsetVector = new Vector3();
const targetScaleVector = new Vector3();
const targetPositionVector = new Vector3();
const objectColor = new Color();

const getNodeIndex = (nodeId: MissionNode["id"]) =>
  Math.max(0, missionNodes.findIndex((node) => node.id === nodeId));

const seeded = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const createParticleGeometry = (count: number, radius: number, depth: number, seed: number) => {
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const a = seeded(seed + index * 1.7) * Math.PI * 2;
    const b = Math.acos(seeded(seed + index * 2.13) * 2 - 1);
    const r = radius * (0.22 + seeded(seed + index * 4.19) * 0.78);
    const x = Math.sin(b) * Math.cos(a) * r;
    const y = Math.cos(b) * depth * 0.45;
    const z = Math.sin(b) * Math.sin(a) * r - depth * 0.15;
    const cool = seeded(seed + index * 0.77);

    objectColor.set(cool > 0.72 ? "#DFFF6A" : cool > 0.42 ? "#6EE7F9" : "#A78BFA");
    positions.push(x, y, z);
    colors.push(objectColor.r, objectColor.g, objectColor.b);
  }

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
};

const createGalaxyGeometry = (
  count: number,
  radius: number,
  depth: number,
  seed: number,
  profile: SceneWorldProfile,
) => {
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const colorA = new Color(profile.nebula[0]);
  const colorB = new Color(profile.nebula[1]);
  const colorC = new Color(profile.nebula[2]);
  const dust = new Color(profile.dust);
  const solar = new Color(profile.solar);

  for (let index = 0; index < count; index += 1) {
    const arm = index % 5;
    const radial = (0.08 + Math.pow(seeded(seed + index * 0.91), 1.9) * 0.92) * radius;
    const sweep =
      radial * 0.58 +
      arm * ((Math.PI * 2) / 5) +
      seeded(seed + index * 1.33) * 0.48;
    const lane = Math.sin(sweep * 2.1 + radial * 0.86);
    const scatter = (seeded(seed + index * 2.4) - 0.5) * (0.28 + radial * 0.034);
    const armNoise = (seeded(seed + index * 2.93) - 0.5) * radial * 0.1;
    const x = Math.cos(sweep) * radial * 1.82 + scatter + armNoise;
    const y =
      (seeded(seed + index * 3.7) - 0.5) *
        depth *
        (0.045 + radial / (radius * 16)) +
      lane * 0.04;
    const z = Math.sin(sweep) * radial * 0.62 - depth * 0.42 + scatter * 0.5;
    const mix = seeded(seed + index * 4.2);
    const coreGlow = Math.max(0, 1 - radial / (radius * 0.54));

    objectColor
      .copy(mix > 0.9 ? solar : mix > 0.68 ? colorC : mix > 0.36 ? colorB : dust)
      .lerp(colorA, radial / radius * 0.26)
      .lerp(solar, coreGlow * 0.22);
    positions.push(x, y, z);
    colors.push(objectColor.r, objectColor.g, objectColor.b);
  }

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
};

const createStellarClusterGeometry = (
  count: number,
  spread: [number, number, number],
  seed: number,
  profile: SceneWorldProfile,
) => {
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const coolWhite = new Color("#F8FAFC");
  const blueWhite = new Color(profile.rim);
  const warmStar = new Color(profile.solar);
  const nebula = new Color(profile.nebula[1]);

  for (let index = 0; index < count; index += 1) {
    const armBias = seeded(seed + index * 0.61);
    const lane = (armBias - 0.5) * 1.8;
    const x = (seeded(seed + index * 1.11) - 0.5) * spread[0] + lane * spread[0] * 0.22;
    const y =
      (seeded(seed + index * 1.91) - 0.5) *
      spread[1] *
      (0.18 + Math.abs(lane) * 0.18);
    const z = (seeded(seed + index * 2.71) - 0.5) * spread[2] - spread[2] * 0.42;
    const colorSeed = seeded(seed + index * 3.31);

    objectColor
      .copy(colorSeed > 0.94 ? warmStar : colorSeed > 0.62 ? coolWhite : blueWhite)
      .lerp(nebula, seeded(seed + index * 4.7) * 0.24);
    positions.push(x, y, z);
    colors.push(objectColor.r, objectColor.g, objectColor.b);
  }

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
};

const CameraRig = () => {
  const {
    activationProgressRef,
    activeNode,
    intensityRef,
    progressRef,
    reducedMotion,
    sceneProgressRef,
    transitionProgressRef,
  } = useEnvironment();

  useFrame(({ camera, clock, pointer }) => {
    const elapsed = clock.getElapsedTime();
    const activationProgress = activationProgressRef.current;
    const intensity = intensityRef.current;
    const progress = progressRef.current;
    const sceneProgress = sceneProgressRef.current;
    const transitionProgress = transitionProgressRef.current;
    const index = getNodeIndex(activeNode);
    const nextIndex = Math.min(missionNodes.length - 1, index + 1);
    const base = cameraPositions[index];
    const next = cameraPositions[nextIndex];
    const orbit = reducedMotion ? 0 : Math.sin(elapsed * 0.13 + index + progress * 2.4) * 0.34;
    const rise = reducedMotion ? 0 : Math.cos(elapsed * 0.17 + index * 0.6) * 0.14;
    const target = cameraTargetVector.copy(base).lerp(next, transitionProgress * 0.44);

    target.x += orbit + pointer.x * 0.08 + (sceneProgress - 0.5) * 0.26;
    target.y += rise + pointer.y * 0.06 + Math.sin(sceneProgress * Math.PI) * 0.2;
    target.z -= progress * 0.92 + intensity * 0.54 + transitionProgress * 0.32 + activationProgress * 0.6;

    camera.position.lerp(target, 0.042);
    camera.lookAt(
      cameraFocus.x + Math.sin(elapsed * 0.08) * 0.08,
      cameraFocus.y + Math.cos(elapsed * 0.1) * 0.05 + activationProgress * 0.03,
      cameraFocus.z,
    );
    if ("fov" in camera) {
      camera.fov = MathUtils.lerp(camera.fov, 43 - transitionProgress * 1.2 - activationProgress * 3.8, 0.04);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

const EnergyCloud = ({
  colorA,
  colorB,
  colorC,
  opacity,
  position,
  rotation = [0, 0, 0],
  scale,
  speed,
}: {
  colorA: string;
  colorB: string;
  colorC?: string;
  opacity: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  speed: number;
}) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const { activationProgressRef, intensityRef, transitionProgressRef } = useEnvironment();
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
      uColorC: { value: new Color(colorC ?? colorB) },
      uIntensity: { value: 0 },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    }),
    [colorA, colorB, colorC, opacity],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const activationProgress = activationProgressRef.current;
    const intensity = intensityRef.current;
    const transitionProgress = transitionProgressRef.current;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * speed;
    materialRef.current.uniforms.uIntensity.value =
      intensity + transitionProgress * 0.55 + activationProgress * 0.65;
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        fragmentShader={`
              varying vec2 vUv;
              uniform vec3 uColorA;
              uniform vec3 uColorB;
              uniform vec3 uColorC;
              uniform float uIntensity;
              uniform float uOpacity;
              uniform float uTime;

              float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
              }

              float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(
                  mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                  mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                  u.y
                );
              }

              void main() {
                vec2 uv = vUv;
                vec2 p = (uv - 0.5) * 2.0;
                float n = noise(uv * 3.1 + vec2(uTime * 0.045, -uTime * 0.03));
                n += noise(uv * 7.4 + vec2(-uTime * 0.026, uTime * 0.04)) * 0.48;
                n += noise(uv * 14.0 + uTime * 0.018) * 0.2;
                float spiral = sin(atan(p.y, p.x) * 3.0 + length(p) * 7.2 - uTime * 0.22);
                float band = 1.0 - smoothstep(0.08, 0.84, abs(p.y + sin(p.x * 2.0 + uTime * 0.08) * 0.16));
                float haze = smoothstep(0.2, 1.2, n);
                float vignette = 1.0 - smoothstep(0.36, 1.28, length(p));
                float ray = pow(max(0.0, 1.0 - abs(p.x * 0.58 + sin(uv.y * 8.0 + uTime * 0.34) * 0.22)), 3.0);
                float galactic = smoothstep(-0.35, 0.78, spiral + n * 0.7);
                float alpha = (haze * 0.16 + ray * 0.08 + galactic * 0.1 + band * (0.08 + n * 0.1)) * vignette * (uOpacity + uIntensity * 0.22);
                vec3 color = mix(mix(uColorA, uColorB, clamp(n, 0.0, 1.0)), uColorC, max(galactic * 0.38, band * 0.28));
                gl_FragColor = vec4(color, alpha);
              }
            `}
        transparent
        uniforms={uniforms}
        vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
      />
    </mesh>
  );
};

const StellarClusterField = ({ quality }: { quality: RenderQuality }) => {
  const pointsRef = useRef<Points>(null);
  const { activationProgressRef, activeNode, intensityRef, progressRef, reducedMotion, transitionProgressRef } =
    useEnvironment();
  const profile = sceneWorldProfiles[activeNode];
  const settings = renderQualitySettings[quality];
  const count = Math.round((quality === "high" ? 940 : quality === "medium" ? 620 : 280) * settings.galaxyParticleScale);
  const geometry = useMemo(
    () => createStellarClusterGeometry(count, [28, 8, 18], getNodeIndex(activeNode) * 71 + 511, profile),
    [activeNode, count, profile],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    pointsRef.current.rotation.z = -0.24 + progressRef.current * 0.24 + Math.sin(elapsed * 0.024) * 0.025;
    pointsRef.current.rotation.y = -0.12 + transitionProgressRef.current * 0.08;
    pointsRef.current.position.z = -8.4 - progressRef.current * 2.2 - activationProgressRef.current * 0.8;
    pointsRef.current.position.x = Math.sin(elapsed * 0.025 + getNodeIndex(activeNode)) * 0.26;
    pointsRef.current.position.y = 0.16 + intensityRef.current * 0.12;
  });

  return (
    <points ref={pointsRef} geometry={geometry} rotation={[0.62, -0.16, -0.24]}>
      <pointsMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        opacity={reducedMotion ? 0.28 : 0.54}
        size={quality === "high" ? 0.02 : quality === "medium" ? 0.026 : 0.038}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
};

const GalacticDustVeil = ({ quality }: { quality: RenderQuality }) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { activationProgressRef, activeNode, intensityRef, reducedMotion, sceneProgressRef, transitionProgressRef } =
    useEnvironment();
  const profile = sceneWorldProfiles[activeNode];
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new Color(profile.shadow) },
      uColorB: { value: new Color(profile.nebula[0]) },
      uIntensity: { value: 0 },
      uOpacity: { value: quality === "low" ? 0.11 : quality === "medium" ? 0.15 : 0.18 },
      uTime: { value: 0 },
    }),
    [profile.nebula, profile.shadow, quality],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = 0.08 + sceneProgressRef.current * 0.06 + Math.sin(elapsed * 0.035) * 0.03;
      meshRef.current.rotation.z = -0.18 + transitionProgressRef.current * 0.045;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = reducedMotion ? 0 : elapsed * 0.22;
      materialRef.current.uniforms.uIntensity.value =
        intensityRef.current * 0.42 + transitionProgressRef.current * 0.28 + activationProgressRef.current * 0.42;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0.1, 0.08, -5.1]}
      rotation={[0, 0, -0.18]}
      scale={[15.4, 7.7, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uIntensity;
          uniform float uOpacity;
          uniform float uTime;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(41.7, 289.1))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float warp = sin(p.x * 2.1 + uTime * 0.12) * 0.16;
            float band = 1.0 - smoothstep(0.08, 0.78, abs(p.y + warp));
            float large = noise(vUv * 4.4 + vec2(uTime * 0.03, -uTime * 0.02));
            float fine = noise(vUv * 13.0 + vec2(-uTime * 0.04, uTime * 0.025));
            float lane = smoothstep(0.46, 0.84, large * 0.72 + fine * 0.28) * band;
            float fracture = smoothstep(0.62, 0.9, fine) * band * 0.52;
            float alpha = (lane * 0.72 + fracture * 0.36) * (uOpacity + uIntensity * 0.05);
            vec3 color = mix(uColorA, uColorB, large * 0.18);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const NeuralParticleLayer = ({
  count,
  depth,
  opacity,
  radius,
  seed,
  size,
  speed,
}: {
  count: number;
  depth: number;
  opacity: number;
  radius: number;
  seed: number;
  size: number;
  speed: number;
}) => {
  const pointsRef = useRef<Points>(null);
  const {
    activationProgress,
    activationProgressRef,
    intensity,
    intensityRef,
    reducedMotion,
    transitionProgressRef,
  } = useEnvironment();
  const geometry = useMemo(
    () => createParticleGeometry(count, radius, depth, seed),
    [count, depth, radius, seed],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    const liveActivation = activationProgressRef.current;
    const liveIntensity = intensityRef.current;
    const transitionProgress = transitionProgressRef.current;
    pointsRef.current.rotation.y = elapsed * speed + transitionProgress * 0.28 + liveActivation * 0.18;
    pointsRef.current.rotation.x = Math.sin(elapsed * speed * 0.52) * 0.08;
    pointsRef.current.position.z =
      Math.sin(elapsed * 0.15 + seed) * 0.28 - liveIntensity * 0.18 - liveActivation * 0.24;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        opacity={reducedMotion ? opacity * 0.58 : opacity + intensity * 0.12 + activationProgress * 0.08}
        size={size + intensity * 0.01 + activationProgress * 0.012}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
};

const GalacticStarRiver = ({ quality }: { quality: RenderQuality }) => {
  const pointsRef = useRef<Points>(null);
  const {
    activationProgressRef,
    activeNode,
    intensityRef,
    reducedMotion,
    sceneProgressRef,
    transitionProgressRef,
  } = useEnvironment();
  const profile = sceneWorldProfiles[activeNode];
  const settings = renderQualitySettings[quality];
  const count = Math.round((quality === "high" ? 1800 : quality === "medium" ? 1150 : 560) * settings.particleScale);
  const geometry = useMemo(
    () => createGalaxyGeometry(count, 8.8, 16, getNodeIndex(activeNode) * 37 + 91, profile),
    [activeNode, count, profile],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    const activationProgress = activationProgressRef.current;
    const intensity = intensityRef.current;
    const sceneProgress = sceneProgressRef.current;
    const transitionProgress = transitionProgressRef.current;

    pointsRef.current.rotation.y =
      (reducedMotion ? 0 : elapsed * 0.006) + sceneProgress * 0.2 + transitionProgress * 0.12;
    pointsRef.current.rotation.z = -0.18 + Math.sin(elapsed * 0.035) * 0.04;
    pointsRef.current.position.z = -6.4 - sceneProgress * 1.2 - transitionProgress * 0.6 - activationProgress * 0.82;
    pointsRef.current.position.x = Math.sin(elapsed * 0.045 + getNodeIndex(activeNode)) * 0.42;
    pointsRef.current.position.y = 0.18 + Math.cos(elapsed * 0.04) * 0.16 + intensity * 0.12;
  });

  return (
    <points ref={pointsRef} geometry={geometry} rotation={[0.74, -0.18, -0.18]} scale={[1.2, 0.82, 1.05]}>
      <pointsMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        opacity={reducedMotion ? 0.34 : 0.56}
        size={quality === "high" ? 0.038 : quality === "medium" ? 0.044 : 0.052}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
};

const PlanetarySilhouette = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();
  const profile = sceneWorldProfiles[activeNode];
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const segments = quality === "high" ? 72 : quality === "medium" ? 48 : 32;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = reducedMotion ? 0 : elapsed * 0.012 + sceneProgress * 0.18;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.035) * 0.04 + transitionProgress * 0.04;
    groupRef.current.position.z = -10.4 - transitionProgress * 0.9 - activationProgress * 0.42;
    groupRef.current.position.x = -5.25 + Math.sin(elapsed * 0.04 + getNodeIndex(activeNode)) * 0.32;
  });

  return (
    <group ref={groupRef} position={[-5.25, 1.2, -10.4]}>
      <mesh scale={[1.52, 1.52, 1.52]}>
        <sphereGeometry args={[1, segments, segments * 0.6]} />
        <meshBasicMaterial color={profile.planet} opacity={0.36 + activationProgress * 0.06} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2.7, 0.16, -0.42]} scale={[2.25, 2.25, 1]}>
        <ringGeometry args={[0.82, 1.2, renderQualitySettings[quality].ringSegments]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.secondary}
          depthWrite={false}
          opacity={0.1 + intensity * 0.06 + activationProgress * 0.06}
          side={DoubleSide}
          transparent
        />
      </mesh>
      <mesh scale={[1.76, 1.76, 1.76]}>
        <sphereGeometry args={[1, segments, segments * 0.5]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={profile.rim}
          depthWrite={false}
          opacity={0.022 + activationProgress * 0.018}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
};

const CosmicLightCorridor = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();
  const profile = sceneWorldProfiles[activeNode];
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const bands = quality === "low" ? [0, 1] : [0, 1, 2];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = (reducedMotion ? 0 : elapsed * 0.018) + sceneProgress * 0.35;
    groupRef.current.rotation.x = 0.42 + Math.sin(elapsed * 0.05) * 0.06;
    groupRef.current.position.z = -2.2 - transitionProgress * 0.9 - activationProgress * 0.56;
  });

  return (
    <group ref={groupRef} position={[0.72, -0.18, -2.2]}>
      {bands.map((band) => (
        <mesh
          key={`corridor-${band}`}
          rotation={[Math.PI / 2 + band * 0.18, band * 0.56, band * 0.28]}
          scale={[1 + band * 0.2, 1 + band * 0.2, 1]}
        >
          <torusGeometry
            args={[2.2 + band * 0.46, band % 2 === 0 ? 0.004 : 0.007, 8, renderQualitySettings[quality].trailSegments]}
          />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={band % 2 === 0 ? profile.solar : node.ambient.secondary}
            depthWrite={false}
            opacity={0.1 + intensity * 0.08 + activationProgress * 0.08 - band * 0.01}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const EnergyTrails = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const {
    activationProgress,
    activationProgressRef,
    activeNode,
    intensity,
    mode,
    reducedMotion,
    sceneProgress,
    sceneProgressRef,
    transitionProgressRef,
  } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const settings = renderQualitySettings[quality];
  const rings = quality === "low" ? [0, 1, 2] : [0, 1, 2, 3];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    const liveActivation = activationProgressRef.current;
    const liveSceneProgress = sceneProgressRef.current;
    const transitionProgress = transitionProgressRef.current;
    groupRef.current.rotation.y =
      elapsed * (reducedMotion ? 0.02 : 0.052 + liveActivation * 0.035) +
      liveSceneProgress * 0.5;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.11) * 0.12 + transitionProgress * 0.18;
    groupRef.current.position.z = -1.4 - transitionProgress * 0.24 - liveActivation * 0.32;
  });

  return (
    <group ref={groupRef} position={[0.85, -0.05, -0.4]}>
      {rings.map((ring) => (
        <mesh
          key={ring}
          rotation={[
            Math.PI / 2 + ring * 0.38,
            ring * 0.47,
            ring * 0.21 + sceneProgress * 0.12,
          ]}
          scale={[1 + ring * 0.12, 1 + ring * 0.08, 1]}
        >
          <torusGeometry
            args={[2.15 + ring * 0.22, ring % 2 === 0 ? 0.004 : 0.007, 8, settings.trailSegments]}
          />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ring % 2 === 0 || mode === "breach" ? node.ambient.alert : node.ambient.secondary}
            depthWrite={false}
            opacity={0.16 + intensity * 0.16 + activationProgress * 0.08 - ring * 0.012}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const VolumetricLightRays = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, mode, reducedMotion, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const rayCount = quality === "low" ? 2 : 3;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(elapsed * 0.09) * 0.08;
    groupRef.current.rotation.y = Math.sin(elapsed * 0.07) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0.6, 0.2, -2.8]}>
      {Array.from({ length: rayCount }, (_, ray) => (
        <mesh
          key={ray}
          rotation={[Math.PI / 2.15, ray * 1.38 + transitionProgress * 0.28, 0]}
          scale={[0.34 + ray * 0.08, 4.6 + ray * 0.72, 0.34]}
        >
          <coneGeometry args={[1, 1, quality === "high" ? 48 : 32, 1, true]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ray % 2 === 0 || mode === "breach" ? node.ambient.secondary : node.ambient.alert}
            depthWrite={false}
            opacity={reducedMotion ? 0.035 : 0.072 + intensity * 0.05 + activationProgress * 0.04}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const HolographicScanVolume = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const settings = renderQualitySettings[quality];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(elapsed * 0.22) * 0.14 - 0.35 + activationProgress * 0.08;
    groupRef.current.rotation.z =
      (reducedMotion ? 0 : elapsed * (0.018 + activationProgress * 0.02)) + sceneProgress * 0.1;
  });

  return (
    <group ref={groupRef} position={[0.62, -0.35, -2.2]} rotation={[1.12, 0, 0]}>
      {[0, 1].map((plane) => (
        <mesh key={plane} position={[0, 0, plane * 0.34 - 0.28]} scale={[5.4 + plane * 0.9, 5.4 + plane * 0.9, 1]}>
          <ringGeometry args={[0.78 + plane * 0.22, 1.02 + plane * 0.24, settings.ringSegments]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={plane === 1 ? node.ambient.alert : node.ambient.secondary}
            depthWrite={false}
            opacity={0.035 + transitionProgress * 0.025 + intensity * 0.025 + activationProgress * 0.04}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const EnergyHorizon = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, sceneProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];
  const settings = renderQualitySettings[quality];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.055) * 0.04;
    groupRef.current.position.y = -1.55 + Math.sin(elapsed * 0.12) * 0.04;
    groupRef.current.position.z = -3.4 - activationProgress * 0.35;
  });

  return (
    <group ref={groupRef} rotation={[1.18, 0, sceneProgress * 0.12]} position={[0.75, -1.55, -3.4]}>
      {[0, 1, 2].map((layer) => (
        <mesh key={layer} position={[0, layer * -0.06, layer * -0.18]} scale={[5.2 + layer * 0.8, 1.1 + layer * 0.18, 1]}>
          <ringGeometry args={[0.46 + layer * 0.15, 0.5 + layer * 0.18, settings.ringSegments]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={layer % 2 === 0 ? profile.horizon : node.ambient.secondary}
            depthWrite={false}
            opacity={0.08 + activationProgress * 0.04 + intensity * 0.035 - layer * 0.01}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const DigitalLandscape = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, transitionProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];
  const pieceCount = quality === "high" ? 8 : quality === "medium" ? 6 : 3;
  const landscape = useMemo(
    () =>
      Array.from({ length: pieceCount }, (_, index) => ({
        height: 0.45 + seeded(index + 50) * 1.35,
        position: [
          -5.4 + index * 1.32,
          -2.05 + seeded(index + 80) * 0.18,
          -4.2 - seeded(index + 110) * 1.5,
        ] as [number, number, number],
        rotation: seeded(index + 140) * 0.28 - 0.14,
        width: 0.34 + seeded(index + 170) * 0.72,
      })),
    [pieceCount],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.position.x = Math.sin(elapsed * 0.06) * 0.18;
    groupRef.current.position.z = Math.sin(elapsed * 0.08) * 0.16 - activationProgress * 0.3;
    groupRef.current.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.045) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {landscape.map((piece, index) => (
        <mesh
          key={`landscape-${index}`}
          position={piece.position}
          rotation={[0, piece.rotation + transitionProgress * 0.08, 0]}
          scale={[piece.width, piece.height + activationProgress * 0.32, 0.22]}
        >
          <coneGeometry args={[1, 1, profile.architecture === "vault" ? 4 : 3]} />
          <meshStandardMaterial
            color={profile.shadow}
            emissive={index % 3 === 0 ? node.ambient.secondary : profile.horizon}
            emissiveIntensity={0.08 + intensity * 0.08 + activationProgress * 0.08}
            metalness={0.25}
            opacity={0.52}
            roughness={0.58}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const ArchitecturalForms = ({ quality }: { quality: RenderQuality }) => {
  const groupRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, reducedMotion, sceneProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];
  const columnCount = quality === "high" ? 5 : quality === "medium" ? 4 : 2;
  const columns = useMemo(
    () =>
      Array.from({ length: columnCount }, (_, index) => ({
        height: 1.8 + seeded(index + 230) * 2.4,
        position: [
          (index - 2) * 2.15,
          -0.45 + seeded(index + 260) * 0.42,
          -5.2 - seeded(index + 290) * 1.9,
        ] as [number, number, number],
        width: 0.08 + seeded(index + 320) * 0.1,
      })),
    [columnCount],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.035) * 0.08;
    groupRef.current.position.y = Math.sin(elapsed * 0.09) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {columns.map((column, index) => (
        <mesh
          key={`architecture-${index}`}
          position={column.position}
          rotation={[0, sceneProgress * 0.18 + index * 0.04, 0]}
          scale={[column.width, column.height, column.width]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={profile.shadow}
            emissive={index % 2 === 0 ? node.ambient.secondary : profile.horizon}
            emissiveIntensity={0.1 + activationProgress * 0.2 + intensity * 0.08}
            metalness={0.42}
            opacity={0.28 + activationProgress * 0.12}
            roughness={0.3}
            transparent
          />
        </mesh>
      ))}
      {profile.architecture === "relay" ? (
        <mesh position={[2.8, 0.4, -4.8]} rotation={[0.2, 0.1, 0]} scale={[0.42, 2.6, 0.42]}>
          <cylinderGeometry args={[0.18, 0.34, 1, 6]} />
          <meshStandardMaterial
            color={profile.shadow}
            emissive={node.ambient.alert}
            emissiveIntensity={0.42 + activationProgress * 0.4}
            metalness={0.58}
            opacity={0.58}
            transparent
          />
        </mesh>
      ) : null}
    </group>
  );
};

const CinematicEnvironment = ({ quality }: { quality: RenderQuality }) => {
  const { activeNode, reducedMotion } = useEnvironment();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];
  const settings = renderQualitySettings[quality];
  const particleScale = reducedMotion ? settings.particleScale * 0.42 : settings.particleScale;

  return (
    <group>
      <GalacticStarRiver quality={quality} />
      <StellarClusterField quality={quality} />
      <EnergyCloud
        colorA={profile.nebula[0]}
        colorB={profile.nebula[1]}
        colorC={profile.nebula[2]}
        opacity={0.98}
        position={[0.2, 0.38, -9.6]}
        rotation={[0, 0, -0.16]}
        scale={[19, 11, 1]}
        speed={0.86}
      />
      <GalacticDustVeil quality={quality} />
      <EnergyCloud
        colorA="#020107"
        colorB={profile.solar}
        colorC={node.ambient.alert}
        opacity={0.48}
        position={[2.1, -0.24, -5.8]}
        rotation={[0.05, 0, 0.12]}
        scale={[10.8, 6.8, 1]}
        speed={0.68}
      />
      <PlanetarySilhouette quality={quality} />
      <DigitalLandscape quality={quality} />
      <ArchitecturalForms quality={quality} />
      <NeuralParticleLayer
        count={Math.round((isMobile ? 320 : 1080) * particleScale)}
        depth={24}
        opacity={0.46}
        radius={18}
        seed={19}
        size={isMobile ? 0.034 : 0.026}
        speed={reducedMotion ? 0.003 : 0.009}
      />
      <NeuralParticleLayer
        count={Math.round((isMobile ? 210 : 720) * particleScale)}
        depth={13}
        opacity={0.58}
        radius={10.2}
        seed={43}
        size={isMobile ? 0.05 : 0.038}
        speed={reducedMotion ? -0.003 : -0.014}
      />
      <NeuralParticleLayer
        count={Math.round((isMobile ? 76 : 280) * particleScale)}
        depth={7}
        opacity={0.3}
        radius={5.6}
        seed={71}
        size={isMobile ? 0.072 : 0.058}
        speed={reducedMotion ? 0.003 : 0.031}
      />
      <CosmicLightCorridor quality={quality} />
      <EnergyTrails quality={quality} />
      <VolumetricLightRays quality={quality} />
      <HolographicScanVolume quality={quality} />
      <EnergyHorizon quality={quality} />
    </group>
  );
};

const EnergyRings = ({
  active,
  color,
  quality,
}: {
  active: boolean;
  color: string;
  quality: RenderQuality;
}) => {
  const groupRef = useRef<Group>(null);
  const { intensity, reducedMotion } = useEnvironment();
  const settings = renderQualitySettings[quality];
  const rings = quality === "low" ? [0, 1] : [0, 1, 2];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = reducedMotion ? 0 : elapsed * (active ? 0.22 : 0.1);
    groupRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring) => (
        <mesh
          key={ring}
          rotation={[
            Math.PI / 2 + ring * 0.35,
            ring * 0.58,
            ring * 0.3,
          ]}
        >
          <torusGeometry args={[1.18 + ring * 0.2, 0.005 + ring * 0.0015, 8, settings.ringSegments]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={color}
            depthWrite={false}
            opacity={active ? 0.42 - ring * 0.045 + intensity * 0.05 : 0.16 - ring * 0.018}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const ChargeHalo = ({
  activationProgress,
  active,
  hovered,
  node,
  quality,
  revealed,
}: ArtifactRenderProps) => {
  const groupRef = useRef<Group>(null);
  const settings = renderQualitySettings[quality];
  const visible = active && (hovered || activationProgress > 0.02 || revealed);
  const safeProgress = Math.max(0.008, activationProgress);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = elapsed * (0.16 + activationProgress * 0.22);
    groupRef.current.rotation.y = Math.sin(elapsed * 0.18) * 0.18;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]} scale={1 + activationProgress * 0.12}>
      <mesh>
        <torusGeometry args={[1.58, 0.005, 8, settings.ringSegments]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.secondary}
          depthWrite={false}
          opacity={0.12 + activationProgress * 0.1}
          transparent
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry
          args={[
            1.58,
            activationProgress >= 0.98 ? 0.017 : 0.011,
            8,
            settings.ringSegments,
            Math.PI * 2 * safeProgress,
          ]}
        />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={activationProgress >= 0.98 ? node.ambient.alert : node.ambient.secondary}
          depthWrite={false}
          opacity={0.38 + activationProgress * 0.34}
          transparent
        />
      </mesh>
      <mesh scale={[1 + activationProgress * 0.28, 1 + activationProgress * 0.28, 1]}>
        <ringGeometry args={[1.7, 1.72, settings.ringSegments]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.alert}
          depthWrite={false}
          opacity={activationProgress >= 0.98 ? 0.18 : 0.045 + activationProgress * 0.08}
          side={DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
};

const EngineeredArtifactDetail = ({
  activationProgress,
  active,
  node,
  quality,
  revealed,
}: ArtifactRenderProps) => {
  const groupRef = useRef<Group>(null);
  const settings = renderQualitySettings[quality];
  const detailCount = Math.round((quality === "high" ? 7 : quality === "medium" ? 5 : 3) * settings.microDetailScale);
  const details = useMemo(
    () =>
      Array.from({ length: Math.max(4, detailCount) }, (_, index) => {
        const angle = (index / Math.max(4, detailCount)) * Math.PI * 2;
        const radius = 0.86 + seeded(index + 510) * 0.34;
        return {
          angle,
          position: [
            Math.cos(angle) * radius,
            (seeded(index + 550) - 0.5) * 1.06,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          scale: 0.034 + seeded(index + 590) * 0.04,
        };
      }),
    [detailCount],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * (active ? 0.18 : 0.07) + activationProgress * 0.24;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
  });

  if (!active && !revealed) return null;

  return (
    <group ref={groupRef}>
      {[0, 1].map((layer) => (
        <mesh
          key={`engrave-${layer}`}
          rotation={[Math.PI / 2 + layer * 0.18, layer * 0.28, layer * 0.44]}
          scale={[1 + layer * 0.08 + activationProgress * 0.04, 1 + layer * 0.08, 1]}
        >
          <torusGeometry args={[0.72 + layer * 0.17, 0.0025 + layer * 0.001, 6, settings.ringSegments]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={layer === 1 ? node.ambient.alert : node.ambient.secondary}
            depthWrite={false}
            opacity={0.18 + activationProgress * 0.16 - layer * 0.025}
            transparent
          />
        </mesh>
      ))}
      {details.map((detail, index) => (
        <group key={`micro-${index}`} position={detail.position} rotation={[detail.angle * 0.2, detail.angle, 0]}>
          <mesh scale={[detail.scale, detail.scale * (quality === "high" ? 2.8 : 2.1), detail.scale * 0.62]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={node.ambient.secondary}
              emissive={index % 3 === 0 ? node.ambient.alert : node.ambient.secondary}
              emissiveIntensity={0.38 + activationProgress * 0.5}
              metalness={0.74}
              opacity={0.34 + activationProgress * 0.12}
              roughness={0.22}
              transparent
            />
          </mesh>
          {index % 2 === 0 ? (
            <mesh position={[0, detail.scale * 2.3, 0]} scale={detail.scale * 0.72}>
              <sphereGeometry args={[1, quality === "high" ? 10 : 8, quality === "high" ? 10 : 8]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={node.ambient.alert}
                depthWrite={false}
                opacity={0.28 + activationProgress * 0.24}
                transparent
              />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
};

const ShardConstellation = ({ activationProgress, active, node, revealed }: ArtifactRenderProps) => {
  const groupRef = useRef<Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        position: [
          Math.cos(index * 1.7) * (1.2 + seeded(index + 5) * 0.52),
          Math.sin(index * 0.9) * 0.92,
          Math.sin(index * 1.33) * 0.62,
        ] as [number, number, number],
        rotation: [
          seeded(index + 11) * Math.PI,
          seeded(index + 22) * Math.PI,
          seeded(index + 33) * Math.PI,
        ] as [number, number, number],
        scale: 0.1 + seeded(index + 44) * 0.16,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * (active ? 0.14 : 0.06);
    groupRef.current.rotation.z = Math.sin(elapsed * 0.17) * 0.16;
  });

  return (
    <group ref={groupRef}>
      {shards.map((shard, index) => (
        <mesh
          key={`${node.id}-shard-${index}`}
          position={shard.position}
          rotation={shard.rotation}
          scale={(revealed ? shard.scale * 1.3 : shard.scale) * (1 + activationProgress * 0.28)}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={node.ambient.secondary}
            emissive={index % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
            emissiveIntensity={active ? 0.95 : 0.34}
            metalness={0.36}
            opacity={active ? 0.48 + activationProgress * 0.18 : 0.22}
            roughness={0.18}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const InternalLattice = ({ active, node, quality, revealed }: ArtifactRenderProps) => {
  const latticeRef = useRef<Group>(null);
  const glow = revealed ? 1.2 : active ? 0.8 : 0.42;
  const settings = renderQualitySettings[quality];

  useFrame(({ clock }) => {
    if (!latticeRef.current) return;
    const elapsed = clock.getElapsedTime();
    latticeRef.current.rotation.y = elapsed * 0.42;
    latticeRef.current.rotation.x = Math.sin(elapsed * 0.31) * 0.3;
  });

  return (
    <group ref={latticeRef}>
      <mesh>
        <icosahedronGeometry args={[0.42, quality === "high" ? 3 : 2]} />
        <meshStandardMaterial
          color={node.ambient.secondary}
          emissive={node.ambient.alert}
          emissiveIntensity={glow}
          metalness={0.28}
          opacity={0.54}
          roughness={0.18}
          transparent
          wireframe
        />
      </mesh>
      <mesh scale={0.36}>
        <sphereGeometry args={[1, quality === "high" ? 30 : 20, quality === "high" ? 30 : 20]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.alert}
          depthWrite={false}
          opacity={0.42 + glow * 0.12}
          transparent
        />
      </mesh>
      {[0, 1].map((ring) => (
        <mesh key={ring} rotation={[ring * 0.7, Math.PI / 2 + ring * 0.42, ring * 0.2]}>
          <torusGeometry args={[0.58 + ring * 0.12, 0.004, 8, settings.ringSegments]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ring === 1 ? node.ambient.secondary : node.ambient.alert}
            depthWrite={false}
            opacity={0.28 + glow * 0.12}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const EnergyEgg = ({ activationProgress, active, node, quality, revealed }: ArtifactRenderProps) => {
  const shellSegments = quality === "high" ? [72, 52] : quality === "medium" ? [56, 40] : [36, 28];
  const wireSegments = quality === "high" ? [52, 36] : quality === "medium" ? [40, 28] : [28, 18];
  const ringSegments = renderQualitySettings[quality].ringSegments;

  return (
  <group>
    <mesh scale={[0.96 + activationProgress * 0.08, 1.28 + activationProgress * 0.1, 0.96]}>
      <sphereGeometry args={[1, shellSegments[0], shellSegments[1]]} />
      <MeshDistortMaterial
        color={node.ambient.secondary}
        distort={active ? 0.3 + activationProgress * 0.12 : 0.18}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.7 : 0.28 + activationProgress * 0.28}
        metalness={0.24}
        opacity={0.54}
        roughness={0.12}
        speed={active ? 1.1 : 0.62}
        transparent
      />
    </mesh>
    <mesh scale={[1.18 + activationProgress * 0.12, 1.45 + activationProgress * 0.18, 1.18]}>
      <sphereGeometry args={[1, wireSegments[0], wireSegments[1]]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.secondary}
        emissiveIntensity={active ? 0.26 : 0.1}
        metalness={0.86}
        opacity={0.18 + activationProgress * 0.1}
        roughness={0.03}
        transparent
        wireframe
      />
    </mesh>
    {[0, 1, 2].map((crack) => (
      <mesh key={crack} rotation={[crack * 0.42, Math.PI / 2 + crack * 0.24, crack * 0.8]}>
        <torusGeometry args={[0.56 + crack * 0.17, 0.0035, 8, ringSegments]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.alert}
          depthWrite={false}
          opacity={activationProgress * (0.28 - crack * 0.04)}
          transparent
        />
      </mesh>
    ))}
  </group>
  );
};

const ScannerLattice = ({ activationProgress, active, node, quality, revealed }: ArtifactRenderProps) => {
  const settings = renderQualitySettings[quality];
  const helixCount = quality === "low" ? 5 : quality === "medium" ? 7 : 9;
  const helix = useMemo(
    () =>
      Array.from({ length: helixCount }, (_, index) => {
        const t = index * 0.62;
        return {
          left: [Math.cos(t) * 0.34, -0.72 + index * 0.085, Math.sin(t) * 0.34] as [
            number,
            number,
            number,
          ],
          right: [Math.cos(t + Math.PI) * 0.34, -0.72 + index * 0.085, Math.sin(t + Math.PI) * 0.34] as [
            number,
            number,
            number,
          ],
        };
      }),
    [helixCount],
  );

  return (
  <group>
    <mesh>
      <icosahedronGeometry args={[1.06, quality === "high" ? 4 : 3]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.72 : 0.34 + activationProgress * 0.2}
        metalness={0.24}
        opacity={0.35}
        roughness={0.12}
        transparent
        wireframe
      />
    </mesh>
    {[0, 1, 2, 3].map((ring) => (
      <mesh key={ring} rotation={[ring * 0.32, Math.PI / 2 + ring * 0.38, ring * 0.46]}>
        <torusGeometry args={[0.92 + ring * 0.18, 0.007, 8, settings.ringSegments]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={ring % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
          depthWrite={false}
          opacity={active ? 0.34 + activationProgress * 0.12 : 0.16}
          transparent
        />
      </mesh>
    ))}
    <group rotation={[0, activationProgress * 0.8, 0]}>
      {helix.map((pair, index) => (
        <group key={`dna-${index}`}>
          <mesh position={pair.left} scale={0.035 + activationProgress * 0.01}>
            <sphereGeometry args={[1, quality === "low" ? 8 : 10, quality === "low" ? 8 : 10]} />
            <meshBasicMaterial color={node.ambient.secondary} />
          </mesh>
          <mesh position={pair.right} scale={0.035 + activationProgress * 0.01}>
            <sphereGeometry args={[1, quality === "low" ? 8 : 10, quality === "low" ? 8 : 10]} />
            <meshBasicMaterial color={node.ambient.alert} />
          </mesh>
          {index % 3 === 0 ? (
            <mesh position={[0, pair.left[1], 0]} rotation={[Math.PI / 2, 0, index * 0.62]} scale={[0.014, 0.014, 0.34]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={node.ambient.alert}
                opacity={0.38 + activationProgress * 0.24}
                transparent
              />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  </group>
  );
};

const CrystalConstruct = ({ activationProgress, active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh rotation={[0.2, 0.28 + activationProgress * 0.18, -0.08]} scale={[0.84 + activationProgress * 0.08, 1.02, 0.84]}>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.9 : 0.42 + activationProgress * 0.22}
        metalness={0.46}
        opacity={0.48}
        roughness={0.08}
        transparent
      />
    </mesh>
    <mesh rotation={[0.95, -0.5 - activationProgress * 0.35, 0.5]} scale={[0.72, 1.28 + activationProgress * 0.18, 0.72]}>
      <octahedronGeometry args={[0.96, 1]} />
      <meshStandardMaterial
        color={node.ambient.alert}
        emissive={node.ambient.secondary}
        emissiveIntensity={active ? 0.52 : 0.22}
        metalness={0.38}
        opacity={0.26 + activationProgress * 0.12}
        roughness={0.1}
        transparent
        wireframe
      />
    </mesh>
  </group>
);

const PhoenixVault = ({ activationProgress, active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh scale={[0.72, 1.06 + activationProgress * 0.12, 0.72]}>
      <dodecahedronGeometry args={[0.86, 1]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 1.1 : 0.52 + activationProgress * 0.28}
        metalness={0.66}
        opacity={0.52}
        roughness={0.12}
        transparent
      />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 0.38, 0.06, 0]}>
        {[0, 1, 2, 3].map((wing) => (
          <mesh
            key={wing}
            position={[
              side * (0.18 + wing * 0.22 + activationProgress * 0.08),
              0.12 + wing * 0.1 + activationProgress * 0.05,
              -0.04 + wing * 0.02,
            ]}
            rotation={[
              0.32 + wing * 0.08,
              side * (0.18 + wing * 0.11 + activationProgress * 0.12),
              side * (0.92 + wing * 0.22 + activationProgress * 0.18),
            ]}
            scale={[0.18 + wing * 0.04, 0.76 + wing * 0.18 + activationProgress * 0.18, 0.08]}
          >
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial
              color={wing % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
              emissive={node.ambient.alert}
              emissiveIntensity={active ? 0.5 : 0.2}
              metalness={0.5}
              opacity={0.42 + activationProgress * 0.12}
              roughness={0.08}
              transparent
            />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const DataMonolith = ({ activationProgress, active, node, revealed }: ArtifactRenderProps) => (
  <group>
    {[0, 1, 2].map((slab) => (
      <mesh
        key={slab}
        position={[
          slab * 0.08 - 0.08 + (slab - 1) * activationProgress * 0.08,
          slab * 0.04,
          slab * 0.09 + activationProgress * 0.05,
        ]}
        rotation={[0.08, -0.24 + slab * 0.1 + activationProgress * 0.06, -0.06]}
      >
        <boxGeometry args={[0.82, 1.5, 0.08, 4, 12, 1]} />
        <meshStandardMaterial
          color={node.ambient.secondary}
          emissive={node.ambient.alert}
          emissiveIntensity={revealed ? 0.68 : 0.28 + activationProgress * 0.2}
          metalness={0.52}
          opacity={0.28 + slab * 0.08 + activationProgress * 0.08}
          roughness={0.16}
          transparent
        />
      </mesh>
    ))}
    <mesh position={[0, 0, 0.18]} scale={[0.04, 1.25, 0.04]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={node.ambient.alert}
        depthWrite={false}
        opacity={active ? 0.72 + activationProgress * 0.14 : 0.34}
        transparent
      />
    </mesh>
  </group>
);

const TransmissionBeacon = ({ activationProgress, active, node, quality, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh rotation={[activationProgress * 0.14, 0, Math.PI / 4]}>
      <octahedronGeometry args={[0.96, 2]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 1.2 : 0.58 + activationProgress * 0.32}
        metalness={0.5}
        opacity={0.54 + activationProgress * 0.1}
        roughness={0.08}
        transparent
      />
    </mesh>
    <mesh position={[0, -1.0, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.42, 1.8, quality === "high" ? 48 : 32, 1, true]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={node.ambient.alert}
        depthWrite={false}
        opacity={active ? 0.22 + activationProgress * 0.18 : 0.12}
        side={DoubleSide}
        transparent
      />
    </mesh>
  </group>
);

const SignatureBody = (props: ArtifactRenderProps) => {
  if (props.node.artifact === "scanner") return <ScannerLattice {...props} />;
  if (props.node.artifact === "construct") return <CrystalConstruct {...props} />;
  if (props.node.artifact === "vault") return <PhoenixVault {...props} />;
  if (props.node.artifact === "dossier") return <DataMonolith {...props} />;
  if (props.node.artifact === "beacon") return <TransmissionBeacon {...props} />;
  return <EnergyEgg {...props} />;
};

const SignatureArtifact = (props: ArtifactRenderProps) => {
  const { active, hovered, node, quality, revealed } = props;
  const settings = renderQualitySettings[quality];

  return (
    <group>
      <SignatureBody {...props} />
      <InternalLattice {...props} />
      <EnergyRings active={hovered || revealed} color={node.ambient.alert} quality={quality} />
      <ChargeHalo {...props} />
      <EngineeredArtifactDetail {...props} />
      <ShardConstellation {...props} />
      <Sparkles
        color={node.ambient.alert}
        count={active ? settings.sparkleActive : settings.sparkleIdle}
        opacity={active ? 0.68 : 0.2}
        scale={active ? 4.2 : 2.2}
        size={active ? 2.25 : 0.9}
        speed={active ? 0.68 : 0.24}
      />
    </group>
  );
};

const InteractiveArtifact = ({
  node,
  onNarration,
  quality,
}: {
  node: MissionNode;
  onNarration: (node: MissionNode | null) => void;
  quality: RenderQuality;
}) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const holdStartRef = useRef<number | null>(null);
  const holdingRef = useRef(false);
  const chargeReadyRef = useRef(false);
  const lastChargeAudioRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [holding, setHolding] = useState(false);
  const {
    activationProgress,
    activationProgressRef,
    activatedNode,
    activeNode,
    intensity,
    intensityRef,
    reducedMotion,
    sceneProgressRef,
    setActivationProgress,
    setActivatedNode,
    setFocusedNode,
    setIntensity,
    setMode,
    transitionProgressRef,
  } = useEnvironment();
  const isActive = activeNode === node.id;
  const isRevealed = activatedNode === node.id;
  const nodeIndex = getNodeIndex(node.id);
  const activeIndex = getNodeIndex(activeNode);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    const liveActivation = activationProgressRef.current;
    const liveIntensity = intensityRef.current;
    const liveSceneProgress = sceneProgressRef.current;
    const liveTransitionProgress = transitionProgressRef.current;

    if (holdingRef.current && holdStartRef.current !== null && isActive) {
      const holdProgress = Math.min((performance.now() - holdStartRef.current) / HOLD_THRESHOLD_MS, 1);
      setActivationProgress(holdProgress);
      setIntensity(Math.max(0.46, holdProgress * 0.92));

      if (performance.now() - lastChargeAudioRef.current > 45) {
        window.cyberAudio?.updateCharge?.(holdProgress);
        lastChargeAudioRef.current = performance.now();
      }

      if (holdProgress >= 1 && !chargeReadyRef.current) {
        chargeReadyRef.current = true;
        window.cyberAudio?.playInterface("ready");
      }
    }

    const distance = Math.abs(activeIndex - nodeIndex);
    const visibility = isActive ? 1 : Math.max(0, 1 - distance * 0.78);
    targetPositionVector
      .copy(isMobile ? mobileArtifactPosition : artifactPosition)
      .add(
        artifactOffsetVector.set(
          (nodeIndex - activeIndex) * 0.34,
          Math.sin(liveSceneProgress * Math.PI) * 0.12,
          -distance * 0.42,
        ),
      );
    const targetScale =
      isActive ? (hovered || holding ? 1.3 : 1.16) + liveIntensity * 0.08 + liveActivation * 0.07 : 0.25;

    groupRef.current.position.lerp(targetPositionVector, 0.06);
    groupRef.current.scale.lerp(targetScaleVector.set(targetScale, targetScale, targetScale), 0.07);
    groupRef.current.rotation.y += reducedMotion ? 0 : 0.006 + liveIntensity * 0.012;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.32 + nodeIndex) * 0.12;
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      (liveSceneProgress - 0.5) * 0.16,
      0.05,
    );

    groupRef.current.visible = visibility > 0.05;
    if (coreRef.current) {
      const material = coreRef.current.material as MeshStandardMaterial;
      if (material.opacity !== undefined) {
        material.opacity = MathUtils.lerp(
          material.opacity,
          isActive
            ? (hovered || isRevealed || holding ? 0.035 : 0.012) +
                liveTransitionProgress * 0.018 +
                liveActivation * 0.025
            : 0,
          0.06,
        );
      }
    }
  });

  const activate = (event?: ThreeEvent<MouseEvent | PointerEvent>) => {
    event?.stopPropagation();
    if (!isActive) return;

    window.cyberAudio?.completeCharge?.();
    setActivationProgress(1);
    setActivatedNode(node.id);
    setFocusedNode(null);
    setIntensity(1);
    setMode(node.id === "operations" ? "breach" : "intelligence");
    onNarration(node);
  };

  const beginHold = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!isActive) return;

    holdStartRef.current = performance.now();
    holdingRef.current = true;
    chargeReadyRef.current = false;
    lastChargeAudioRef.current = 0;
    setHolding(true);
    setFocusedNode(node.id);
    setActivationProgress(0.08);
    setIntensity(0.46);
    setMode("scan");
    window.cyberAudio?.startCharge?.();
  };

  const releaseHold = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!isActive || holdStartRef.current === null) return;

    const elapsed = performance.now() - holdStartRef.current;
    holdStartRef.current = null;
    holdingRef.current = false;
    setHolding(false);

    if (elapsed >= HOLD_THRESHOLD_MS || chargeReadyRef.current || activationProgressRef.current >= 0.98) {
      window.cyberAudio?.updateCharge?.(1);
      activate(event);
      return;
    }

    chargeReadyRef.current = false;
    setActivationProgress(0);
    setFocusedNode(null);
    setIntensity(isRevealed ? 1 : 0);
    window.cyberAudio?.cancelCharge?.();
  };

  const cancelHold = () => {
    if (!holding) return;
    holdStartRef.current = null;
    holdingRef.current = false;
    chargeReadyRef.current = false;
    setHolding(false);
    setActivationProgress(0);
    setFocusedNode(null);
    setIntensity(isRevealed ? 1 : 0);
    window.cyberAudio?.cancelCharge?.();
  };

  const setObjectHover = (nextHover: boolean) => {
    if (!isActive) return;
    setHovered(nextHover);
    setFocusedNode(nextHover ? node.id : null);
    setIntensity(nextHover ? 0.46 : isRevealed ? 1 : 0);
    if (nextHover) window.cyberAudio?.playInterface("hover");
  };

  return (
    <group
      ref={groupRef}
      onPointerCancel={cancelHold}
      onPointerDown={beginHold}
      onPointerOut={() => {
        setObjectHover(false);
        cancelHold();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setObjectHover(true);
      }}
      onPointerUp={releaseHold}
    >
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.12, 36, 36]} />
        <meshBasicMaterial
          color={node.ambient.secondary}
          depthWrite={false}
          opacity={0.02}
          transparent
        />
      </mesh>
      <Float
        floatIntensity={reducedMotion ? 0 : 0.58}
        floatingRange={[-0.09, 0.13]}
        rotationIntensity={reducedMotion ? 0 : 0.2}
        speed={1.05}
      >
        <SignatureArtifact
          activationProgress={activationProgress}
          active={isActive}
          hovered={hovered || holding}
          node={node}
          quality={quality}
          revealed={isRevealed}
        />
      </Float>
      {isActive ? (
        <>
          <pointLight
            color={node.ambient.secondary}
            distance={8}
            intensity={3.4 + intensity * 3.2}
            position={[0.8, 0.5, 1.4]}
          />
          {quality !== "low" ? (
            <pointLight
              color={node.ambient.alert}
              distance={5.2}
              intensity={1.2 + intensity * 2.1}
              position={[-0.9, -0.3, 1.2]}
            />
          ) : null}
        </>
      ) : null}
    </group>
  );
};

const SceneLighting = ({ quality }: { quality: RenderQuality }) => {
  const keyRef = useRef<Group>(null);
  const { activationProgress, activeNode, intensity, mode, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];

  useFrame(({ clock }) => {
    if (!keyRef.current) return;
    const elapsed = clock.getElapsedTime();
    keyRef.current.rotation.y = Math.sin(elapsed * 0.08) * 0.28;
    keyRef.current.rotation.x = Math.cos(elapsed * 0.07) * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.18 + transitionProgress * 0.08 + activationProgress * 0.05} />
      <hemisphereLight
        color={profile.nebula[2]}
        groundColor={profile.nebula[0]}
        intensity={0.4 + intensity * 0.2 + activationProgress * 0.14}
      />
      <group ref={keyRef}>
        <directionalLight
          color={profile.rim}
          intensity={2.4 + intensity * 1.4 + activationProgress * 0.9}
          position={[4.2, 3.6, 4.8]}
        />
        <spotLight
          angle={0.42}
          color={mode === "breach" ? profile.solar : node.ambient.secondary}
          intensity={5.6 + intensity * 5.4 + activationProgress * 2.8}
          penumbra={0.8}
          position={[-2.8, 3.5, 5]}
        />
        {quality !== "low" ? (
          <spotLight
            angle={0.55}
            color={profile.solar}
            intensity={1.8 + intensity * 2.3 + activationProgress * 2.0}
            penumbra={0.9}
            position={[3.2, -1.1, 3.4]}
          />
        ) : null}
      </group>
    </>
  );
};

const World = ({
  onNarration,
  quality,
}: World3DSceneProps & { quality: RenderQuality }) => {
  const { activationProgress, activeNode, intensity, reducedMotion, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const profile = sceneWorldProfiles[activeNode];
  const activeIndex = getNodeIndex(activeNode);
  const settings = renderQualitySettings[quality];
  const visibleNodes = useMemo(
    () =>
      missionNodes.filter(
        (missionNode) =>
          Math.abs(getNodeIndex(missionNode.id) - activeIndex) <= settings.visibleNeighborRange,
      ),
    [activeIndex, settings.visibleNeighborRange],
  );

  const fogColor = useMemo(
    () => new Color(profile.nebula[0]).lerp(new Color(profile.nebula[1]), 0.28).lerp(new Color("#020107"), 0.32),
    [profile.nebula],
  );

  return (
    <>
      <color args={[profile.nebula[0]]} attach="background" />
      <fog
        attach="fog"
        args={[
          fogColor,
          4.4 - intensity * 0.34 - activationProgress * 0.54,
          18 - transitionProgress * 2.2 - activationProgress * 1.6,
        ]}
      />
      <CameraRig />
      <SceneLighting quality={quality} />
      <Stars
        count={reducedMotion ? Math.round(settings.starCount * 0.35) : settings.starCount}
        depth={42}
        factor={2.8}
        fade
        radius={48}
        saturation={0}
        speed={reducedMotion ? 0 : 0.32}
      />
      <CinematicEnvironment quality={quality} />
      {settings.environmentPreset ? <Environment preset="night" /> : null}
      {visibleNodes.map((missionNode) => (
        <InteractiveArtifact
          key={missionNode.id}
          node={missionNode}
          onNarration={onNarration}
          quality={quality}
        />
      ))}
    </>
  );
};

const PerformanceStatsProbe = ({ quality }: { quality: RenderQuality }) => {
  const { gl } = useThree();
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(0);

  useFrame(({ clock }) => {
    frameCountRef.current += 1;
    const now = clock.elapsedTime * 1000;
    if (now - lastUpdateRef.current < 650) return;

    const elapsed = Math.max(1, now - lastUpdateRef.current);
    const fps = Math.round((frameCountRef.current * 1000) / elapsed);
    frameCountRef.current = 0;
    lastUpdateRef.current = now;

    const debugNode = document.getElementById("perf-debug");
    if (!debugNode) return;

    const render = gl.info.render;
    debugNode.textContent = `FPS ${fps} / ${quality.toUpperCase()} / calls ${render.calls} / tris ${render.triangles}`;
  });

  return null;
};

const PerformanceDebugOverlay = ({ quality }: { quality: RenderQuality }) => (
  <div
    className="pointer-events-none fixed bottom-4 left-4 z-[90] rounded-full border border-white/10 bg-black/45 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/58 backdrop-blur-xl"
    id="perf-debug"
  >
    FPS measuring / {quality}
  </div>
);

const World3DSceneComponent = ({ onNarration }: World3DSceneProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const quality = useMemo(detectRenderQuality, []);
  const settings = renderQualitySettings[quality];
  const debugPerformance = shouldShowPerformanceDebug();

  return (
    <div className="fixed inset-0 z-[8]">
      {/* PERF: R3F owns the world RAF loop; particle geometry and shader materials are disposed when the Canvas unmounts. */}
      <Canvas
        camera={{ fov: isMobile ? 58 : 42, near: 0.1, position: [0.12, 0.35, 6.65] }}
        dpr={settings.dpr}
        gl={{
          alpha: false,
          antialias: settings.antialias,
          powerPreference: "high-performance",
        }}
        shadows={false}
      >
        {debugPerformance ? <PerformanceStatsProbe quality={quality} /> : null}
        <World onNarration={onNarration} quality={quality} />
      </Canvas>
      {debugPerformance ? <PerformanceDebugOverlay quality={quality} /> : null}
    </div>
  );
};

export const World3DScene = memo(World3DSceneComponent);
