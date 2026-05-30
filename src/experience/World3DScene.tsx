import { memo, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
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
import type { MissionNode } from "./types";

type World3DSceneProps = {
  onNarration: (node: MissionNode | null) => void;
};

type ArtifactRenderProps = {
  active: boolean;
  node: MissionNode;
  revealed: boolean;
  hovered: boolean;
};

const cameraPositions = [
  new Vector3(0.12, 0.35, 6.65),
  new Vector3(1.08, 0.24, 6.25),
  new Vector3(-0.88, 0.78, 6.05),
  new Vector3(1.28, -0.2, 5.9),
  new Vector3(-1.16, 0.5, 6.25),
  new Vector3(0.2, 0.2, 6.5),
];

const artifactPosition = new Vector3(1.16, -0.04, 0);
const mobileArtifactPosition = new Vector3(0, -1.18, 0);
const cameraFocus = new Vector3(0.52, -0.03, 0);
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

const CameraRig = () => {
  const { activeNode, intensity, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();

  useFrame(({ camera, clock, pointer }) => {
    const elapsed = clock.getElapsedTime();
    const index = getNodeIndex(activeNode);
    const nextIndex = Math.min(missionNodes.length - 1, index + 1);
    const base = cameraPositions[index];
    const next = cameraPositions[nextIndex];
    const orbit = reducedMotion ? 0 : Math.sin(elapsed * 0.13 + index) * 0.24;
    const rise = reducedMotion ? 0 : Math.cos(elapsed * 0.17 + index * 0.6) * 0.1;
    const target = base.clone().lerp(next, transitionProgress * 0.44);

    target.x += orbit + pointer.x * 0.08 + (sceneProgress - 0.5) * 0.18;
    target.y += rise + pointer.y * 0.06 + Math.sin(sceneProgress * Math.PI) * 0.14;
    target.z -= intensity * 0.54 + transitionProgress * 0.18;

    camera.position.lerp(target, 0.042);
    camera.lookAt(
      cameraFocus.x + Math.sin(elapsed * 0.08) * 0.08,
      cameraFocus.y + Math.cos(elapsed * 0.1) * 0.05,
      cameraFocus.z,
    );
  });

  return null;
};

const EnergyCloud = ({
  colorA,
  colorB,
  opacity,
  position,
  scale,
  speed,
}: {
  colorA: string;
  colorB: string;
  opacity: number;
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
}) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const { intensity, transitionProgress } = useEnvironment();
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
      uIntensity: { value: 0 },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    }),
    [colorA, colorB, opacity],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * speed;
    materialRef.current.uniforms.uIntensity.value = intensity + transitionProgress * 0.55;
  });

  return (
    <mesh position={position} scale={scale}>
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
                float haze = smoothstep(0.2, 1.2, n);
                float vignette = 1.0 - smoothstep(0.36, 1.28, length(p));
                float ray = pow(max(0.0, 1.0 - abs(p.x * 0.58 + sin(uv.y * 8.0 + uTime * 0.34) * 0.22)), 3.0);
                float alpha = (haze * 0.24 + ray * 0.11) * vignette * (uOpacity + uIntensity * 0.22);
                vec3 color = mix(uColorA, uColorB, clamp(n, 0.0, 1.0));
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
  const { intensity, reducedMotion, transitionProgress } = useEnvironment();
  const geometry = useMemo(
    () => createParticleGeometry(count, radius, depth, seed),
    [count, depth, radius, seed],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    pointsRef.current.rotation.y = elapsed * speed + transitionProgress * 0.28;
    pointsRef.current.rotation.x = Math.sin(elapsed * speed * 0.52) * 0.08;
    pointsRef.current.position.z = Math.sin(elapsed * 0.15 + seed) * 0.28 - intensity * 0.18;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        opacity={reducedMotion ? opacity * 0.58 : opacity + intensity * 0.12}
        size={size + intensity * 0.01}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
};

const EnergyTrails = () => {
  const groupRef = useRef<Group>(null);
  const { activeNode, intensity, mode, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];
  const rings = [0, 1, 2, 3, 4, 5];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * (reducedMotion ? 0.02 : 0.052) + sceneProgress * 0.5;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.11) * 0.12 + transitionProgress * 0.18;
    groupRef.current.position.z = -1.4 - transitionProgress * 0.24;
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
          <torusGeometry args={[2.15 + ring * 0.22, ring % 2 === 0 ? 0.004 : 0.007, 8, 220]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ring % 2 === 0 || mode === "breach" ? node.ambient.alert : node.ambient.secondary}
            depthWrite={false}
            opacity={0.16 + intensity * 0.16 - ring * 0.012}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const VolumetricLightRays = () => {
  const groupRef = useRef<Group>(null);
  const { activeNode, intensity, mode, reducedMotion, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(elapsed * 0.09) * 0.08;
    groupRef.current.rotation.y = Math.sin(elapsed * 0.07) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0.6, 0.2, -2.8]}>
      {[0, 1, 2, 3].map((ray) => (
        <mesh
          key={ray}
          rotation={[Math.PI / 2.15, ray * 1.38 + transitionProgress * 0.28, 0]}
          scale={[0.34 + ray * 0.08, 4.6 + ray * 0.72, 0.34]}
        >
          <coneGeometry args={[1, 1, 64, 1, true]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ray % 2 === 0 || mode === "breach" ? node.ambient.secondary : node.ambient.alert}
            depthWrite={false}
            opacity={reducedMotion ? 0.035 : 0.072 + intensity * 0.05}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const HolographicScanVolume = () => {
  const groupRef = useRef<Group>(null);
  const { activeNode, intensity, reducedMotion, sceneProgress, transitionProgress } =
    useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(elapsed * 0.22) * 0.14 - 0.35;
    groupRef.current.rotation.z = (reducedMotion ? 0 : elapsed * 0.018) + sceneProgress * 0.1;
  });

  return (
    <group ref={groupRef} position={[0.62, -0.35, -2.2]} rotation={[1.12, 0, 0]}>
      {[0, 1, 2].map((plane) => (
        <mesh key={plane} position={[0, 0, plane * 0.34 - 0.28]} scale={[5.4 + plane * 0.9, 5.4 + plane * 0.9, 1]}>
          <ringGeometry args={[0.78 + plane * 0.22, 1.02 + plane * 0.24, 96]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={plane === 1 ? node.ambient.alert : node.ambient.secondary}
            depthWrite={false}
            opacity={0.035 + transitionProgress * 0.025 + intensity * 0.025}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const CinematicEnvironment = () => {
  const { activeNode, reducedMotion } = useEnvironment();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  return (
    <group>
      <EnergyCloud
        colorA={node.ambient.primary}
        colorB={node.ambient.secondary}
        opacity={0.86}
        position={[0, 0.5, -7.8]}
        scale={[16, 9.5, 1]}
        speed={1}
      />
      <EnergyCloud
        colorA="#020107"
        colorB={node.ambient.alert}
        opacity={0.58}
        position={[1.6, -0.35, -5.4]}
        scale={[9.5, 6.4, 1]}
        speed={0.72}
      />
      <NeuralParticleLayer
        count={isMobile ? 340 : 940}
        depth={18}
        opacity={0.52}
        radius={15}
        seed={19}
        size={isMobile ? 0.036 : 0.028}
        speed={reducedMotion ? 0.004 : 0.012}
      />
      <NeuralParticleLayer
        count={isMobile ? 220 : 620}
        depth={10}
        opacity={0.62}
        radius={8.4}
        seed={43}
        size={isMobile ? 0.052 : 0.04}
        speed={reducedMotion ? -0.004 : -0.019}
      />
      <NeuralParticleLayer
        count={isMobile ? 80 : 240}
        depth={6}
        opacity={0.34}
        radius={4.8}
        seed={71}
        size={isMobile ? 0.072 : 0.058}
        speed={reducedMotion ? 0.003 : 0.031}
      />
      <EnergyTrails />
      <VolumetricLightRays />
      <HolographicScanVolume />
    </group>
  );
};

const EnergyRings = ({ active, color }: { active: boolean; color: string }) => {
  const groupRef = useRef<Group>(null);
  const { intensity, reducedMotion } = useEnvironment();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = reducedMotion ? 0 : elapsed * (active ? 0.22 : 0.1);
    groupRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map((ring) => (
        <mesh
          key={ring}
          rotation={[
            Math.PI / 2 + ring * 0.35,
            ring * 0.58,
            ring * 0.3,
          ]}
        >
          <torusGeometry args={[1.18 + ring * 0.2, 0.005 + ring * 0.0015, 10, 180]} />
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

const ShardConstellation = ({ active, node, revealed }: ArtifactRenderProps) => {
  const groupRef = useRef<Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
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
          scale={revealed ? shard.scale * 1.3 : shard.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={node.ambient.secondary}
            emissive={index % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
            emissiveIntensity={active ? 0.95 : 0.34}
            metalness={0.36}
            opacity={active ? 0.48 : 0.22}
            roughness={0.18}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const InternalLattice = ({ active, node, revealed }: ArtifactRenderProps) => {
  const latticeRef = useRef<Group>(null);
  const glow = revealed ? 1.2 : active ? 0.8 : 0.42;

  useFrame(({ clock }) => {
    if (!latticeRef.current) return;
    const elapsed = clock.getElapsedTime();
    latticeRef.current.rotation.y = elapsed * 0.42;
    latticeRef.current.rotation.x = Math.sin(elapsed * 0.31) * 0.3;
  });

  return (
    <group ref={latticeRef}>
      <mesh>
        <icosahedronGeometry args={[0.42, 3]} />
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
        <sphereGeometry args={[1, 36, 36]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={node.ambient.alert}
          depthWrite={false}
          opacity={0.42 + glow * 0.12}
          transparent
        />
      </mesh>
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} rotation={[ring * 0.7, Math.PI / 2 + ring * 0.42, ring * 0.2]}>
          <torusGeometry args={[0.58 + ring * 0.12, 0.004, 8, 96]} />
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

const EnergyEgg = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh scale={[0.96, 1.28, 0.96]}>
      <sphereGeometry args={[1, 112, 80]} />
      <MeshDistortMaterial
        color={new Color(node.ambient.secondary)}
        distort={active ? 0.3 : 0.18}
        emissive={new Color(node.ambient.alert)}
        emissiveIntensity={revealed ? 0.56 : 0.28}
        metalness={0.24}
        opacity={0.54}
        roughness={0.12}
        speed={active ? 1.1 : 0.62}
        transparent
      />
    </mesh>
    <mesh scale={[1.18, 1.45, 1.18]}>
      <sphereGeometry args={[1, 72, 52]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.secondary}
        emissiveIntensity={active ? 0.26 : 0.1}
        metalness={0.86}
        opacity={0.18}
        roughness={0.03}
        transparent
        wireframe
      />
    </mesh>
  </group>
);

const ScannerLattice = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh>
      <icosahedronGeometry args={[1.06, 5]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.62 : 0.34}
        metalness={0.24}
        opacity={0.35}
        roughness={0.12}
        transparent
        wireframe
      />
    </mesh>
    {[0, 1, 2, 3].map((ring) => (
      <mesh key={ring} rotation={[ring * 0.32, Math.PI / 2 + ring * 0.38, ring * 0.46]}>
        <torusGeometry args={[0.92 + ring * 0.18, 0.007, 8, 144]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={ring % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
          depthWrite={false}
          opacity={active ? 0.34 : 0.16}
          transparent
        />
      </mesh>
    ))}
  </group>
);

const CrystalConstruct = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh rotation={[0.2, 0.28, -0.08]} scale={[0.84, 1.02, 0.84]}>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.75 : 0.42}
        metalness={0.46}
        opacity={0.48}
        roughness={0.08}
        transparent
      />
    </mesh>
    <mesh rotation={[0.95, -0.5, 0.5]} scale={[0.72, 1.28, 0.72]}>
      <octahedronGeometry args={[0.96, 1]} />
      <meshStandardMaterial
        color={node.ambient.alert}
        emissive={node.ambient.secondary}
        emissiveIntensity={active ? 0.52 : 0.22}
        metalness={0.38}
        opacity={0.26}
        roughness={0.1}
        transparent
        wireframe
      />
    </mesh>
  </group>
);

const PhoenixVault = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh scale={[0.72, 1.06, 0.72]}>
      <dodecahedronGeometry args={[0.86, 1]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 0.92 : 0.52}
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
            position={[side * (0.18 + wing * 0.22), 0.12 + wing * 0.1, -0.04 + wing * 0.02]}
            rotation={[0.32 + wing * 0.08, side * (0.18 + wing * 0.11), side * (0.92 + wing * 0.22)]}
            scale={[0.18 + wing * 0.04, 0.76 + wing * 0.18, 0.08]}
          >
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial
              color={wing % 2 === 0 ? node.ambient.alert : node.ambient.secondary}
              emissive={node.ambient.alert}
              emissiveIntensity={active ? 0.5 : 0.2}
              metalness={0.5}
              opacity={0.42}
              roughness={0.08}
              transparent
            />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const DataMonolith = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    {[0, 1, 2].map((slab) => (
      <mesh key={slab} position={[slab * 0.08 - 0.08, slab * 0.04, slab * 0.09]} rotation={[0.08, -0.24 + slab * 0.1, -0.06]}>
        <boxGeometry args={[0.82, 1.5, 0.08, 4, 12, 1]} />
        <meshStandardMaterial
          color={node.ambient.secondary}
          emissive={node.ambient.alert}
          emissiveIntensity={revealed ? 0.54 : 0.28}
          metalness={0.52}
          opacity={0.28 + slab * 0.08}
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
        opacity={active ? 0.72 : 0.34}
        transparent
      />
    </mesh>
  </group>
);

const TransmissionBeacon = ({ active, node, revealed }: ArtifactRenderProps) => (
  <group>
    <mesh rotation={[0, 0, Math.PI / 4]}>
      <octahedronGeometry args={[0.96, 2]} />
      <meshStandardMaterial
        color={node.ambient.secondary}
        emissive={node.ambient.alert}
        emissiveIntensity={revealed ? 1.05 : 0.58}
        metalness={0.5}
        opacity={0.54}
        roughness={0.08}
        transparent
      />
    </mesh>
    <mesh position={[0, -1.0, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.42, 1.8, 64, 1, true]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={node.ambient.alert}
        depthWrite={false}
        opacity={active ? 0.22 : 0.12}
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
  const { active, hovered, node, revealed } = props;

  return (
    <group>
      <SignatureBody {...props} />
      <InternalLattice {...props} />
      <EnergyRings active={hovered || revealed} color={node.ambient.alert} />
      <ShardConstellation {...props} />
      <Sparkles
        color={node.ambient.alert}
        count={active ? 120 : 36}
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
}: {
  node: MissionNode;
  onNarration: (node: MissionNode | null) => void;
}) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const {
    activatedNode,
    activeNode,
    intensity,
    reducedMotion,
    sceneProgress,
    setActivatedNode,
    setFocusedNode,
    setIntensity,
    setMode,
    transitionProgress,
  } = useEnvironment();
  const isActive = activeNode === node.id;
  const isRevealed = activatedNode === node.id;
  const nodeIndex = getNodeIndex(node.id);
  const activeIndex = getNodeIndex(activeNode);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    const distance = Math.abs(activeIndex - nodeIndex);
    const visibility = isActive ? 1 : Math.max(0, 1 - distance * 0.78);
    targetPositionVector
      .copy(isMobile ? mobileArtifactPosition : artifactPosition)
      .add(new Vector3((nodeIndex - activeIndex) * 0.34, Math.sin(sceneProgress * Math.PI) * 0.12, -distance * 0.42));
    const targetScale = isActive ? (hovered ? 1.28 : 1.16) + intensity * 0.08 : 0.25;

    groupRef.current.position.lerp(targetPositionVector, 0.06);
    groupRef.current.scale.lerp(targetScaleVector.set(targetScale, targetScale, targetScale), 0.07);
    groupRef.current.rotation.y += reducedMotion ? 0 : 0.006 + intensity * 0.012;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.32 + nodeIndex) * 0.12;
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      (sceneProgress - 0.5) * 0.16,
      0.05,
    );

    groupRef.current.visible = visibility > 0.05;
    if (coreRef.current) {
      const material = coreRef.current.material as MeshStandardMaterial;
      if (material.opacity !== undefined) {
        material.opacity = MathUtils.lerp(
          material.opacity,
          isActive ? (hovered || isRevealed ? 0.035 : 0.012) + transitionProgress * 0.018 : 0,
          0.06,
        );
      }
    }
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!isActive) return;

    window.cyberAudio?.playInterface("unlock");
    setActivatedNode(node.id);
    setFocusedNode(null);
    setIntensity(1);
    setMode(node.id === "operations" ? "breach" : "intelligence");
    onNarration(node);
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
      onClick={activate}
      onPointerOut={() => setObjectHover(false)}
      onPointerOver={(event) => {
        event.stopPropagation();
        setObjectHover(true);
      }}
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
        <SignatureArtifact active={isActive} hovered={hovered} node={node} revealed={isRevealed} />
      </Float>
      <pointLight
        color={node.ambient.secondary}
        distance={8}
        intensity={isActive ? 3.4 + intensity * 3.6 : 0.55}
        position={[0.8, 0.5, 1.4]}
      />
      <pointLight
        color={node.ambient.alert}
        distance={5.2}
        intensity={isActive ? 1.2 + intensity * 2.4 : 0.24}
        position={[-0.9, -0.3, 1.2]}
      />
    </group>
  );
};

const SceneLighting = () => {
  const keyRef = useRef<Group>(null);
  const { activeNode, intensity, mode, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  useFrame(({ clock }) => {
    if (!keyRef.current) return;
    const elapsed = clock.getElapsedTime();
    keyRef.current.rotation.y = Math.sin(elapsed * 0.08) * 0.28;
    keyRef.current.rotation.x = Math.cos(elapsed * 0.07) * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.15 + transitionProgress * 0.08} />
      <hemisphereLight
        color={node.ambient.secondary}
        groundColor="#040108"
        intensity={0.34 + intensity * 0.18}
      />
      <group ref={keyRef}>
        <directionalLight
          color={node.ambient.secondary}
          intensity={2.2 + intensity * 1.5}
          position={[3.8, 3.2, 4.4]}
        />
        <spotLight
          angle={0.38}
          color={mode === "breach" ? node.ambient.alert : node.ambient.secondary}
          intensity={5.2 + intensity * 5.2}
          penumbra={0.8}
          position={[-2.8, 3.5, 5]}
        />
        <spotLight
          angle={0.55}
          color={node.ambient.alert}
          intensity={1.6 + intensity * 2.2}
          penumbra={0.9}
          position={[3.2, -1.1, 3.4]}
        />
      </group>
    </>
  );
};

const World = ({ onNarration }: World3DSceneProps) => {
  const { activeNode, intensity, reducedMotion, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  const fogColor = useMemo(
    () => new Color(node.ambient.primary).lerp(new Color("#020107"), 0.56),
    [node.ambient.primary],
  );

  return (
    <>
      <color args={["#020107"]} attach="background" />
      <fog attach="fog" args={[fogColor, 5.4 - intensity * 0.4, 16 - transitionProgress * 1.8]} />
      <CameraRig />
      <SceneLighting />
      <Stars
        count={reducedMotion ? 420 : 1300}
        depth={42}
        factor={2.8}
        fade
        radius={48}
        saturation={0}
        speed={reducedMotion ? 0 : 0.32}
      />
      <CinematicEnvironment />
      <Environment preset="night" />
      {missionNodes.map((missionNode) => (
        <InteractiveArtifact
          key={missionNode.id}
          node={missionNode}
          onNarration={onNarration}
        />
      ))}
    </>
  );
};

const World3DSceneComponent = ({ onNarration }: World3DSceneProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-[8]">
      {/* PERF: R3F owns the world RAF loop; particle geometry and shader materials are disposed when the Canvas unmounts. */}
      <Canvas
        camera={{ fov: isMobile ? 58 : 42, near: 0.1, position: [0.12, 0.35, 6.65] }}
        dpr={isMobile ? [0.75, 1.1] : [1, 1.45]}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows={false}
      >
        <World onNarration={onNarration} />
      </Canvas>
    </div>
  );
};

export const World3DScene = memo(World3DSceneComponent);
