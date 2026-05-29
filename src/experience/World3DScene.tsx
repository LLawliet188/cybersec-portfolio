import { memo, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Stars,
  Torus,
} from "@react-three/drei";
import {
  AdditiveBlending,
  Color,
  Group,
  MathUtils,
  Mesh,
  Vector3,
  type MeshStandardMaterial,
} from "three";
import { missionNodes } from "./missionContent";
import { useEnvironment } from "./EnvironmentProvider";
import type { MissionNode } from "./types";

type World3DSceneProps = {
  onNarration: (node: MissionNode | null) => void;
};

const cameraPositions = [
  new Vector3(0.4, 0.4, 7.4),
  new Vector3(1.35, 0.2, 6.8),
  new Vector3(-0.9, 0.85, 6.5),
  new Vector3(1.15, -0.15, 6.25),
  new Vector3(-1.25, 0.45, 6.65),
  new Vector3(0.2, 0.25, 7.0),
];

const artifactPosition = new Vector3(1.35, -0.05, 0);
const mobileArtifactPosition = new Vector3(0, -1.25, 0);
const targetScaleVector = new Vector3();

const getNodeIndex = (nodeId: MissionNode["id"]) =>
  Math.max(0, missionNodes.findIndex((node) => node.id === nodeId));

const CameraRig = () => {
  const { activeNode, intensity, sceneProgress, transitionProgress } = useEnvironment();

  useFrame(({ camera }) => {
    const index = getNodeIndex(activeNode);
    const nextIndex = Math.min(missionNodes.length - 1, index + 1);
    const base = cameraPositions[index];
    const next = cameraPositions[nextIndex];
    const target = base.clone().lerp(next, transitionProgress * 0.32);

    target.z -= intensity * 0.35;
    target.x += (sceneProgress - 0.5) * 0.18;
    target.y += Math.sin(sceneProgress * Math.PI) * 0.12;

    camera.position.lerp(target, 0.045);
    camera.lookAt(0.18, -0.05, 0);
  });

  return null;
};

const EnergyRings = ({ color, active }: { active: boolean; color: string }) => (
  <group>
    {[0, 1, 2].map((ring) => (
      <Torus
        args={[1.52 + ring * 0.28, 0.006, 10, 144]}
        key={ring}
        rotation={[
          Math.PI / 2 + ring * 0.35,
          ring * 0.55,
          ring * 0.25,
        ]}
      >
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          opacity={active ? 0.48 - ring * 0.08 : 0.24 - ring * 0.04}
          transparent
        />
      </Torus>
    ))}
  </group>
);

const ArtifactGeometry = ({ node }: { node: MissionNode }) => {
  const materialColor = new Color(node.ambient.secondary);
  const alertColor = new Color(node.ambient.alert);

  if (node.artifact === "construct") {
    return (
      <mesh castShadow>
        <tetrahedronGeometry args={[1.16, 1]} />
        <meshStandardMaterial
          color={materialColor}
          emissive={alertColor}
          emissiveIntensity={0.45}
          metalness={0.42}
          opacity={0.62}
          roughness={0.18}
          transparent
          wireframe={false}
        />
      </mesh>
    );
  }

  if (node.artifact === "vault") {
    return (
      <mesh castShadow>
        <dodecahedronGeometry args={[1.08, 1]} />
        <meshStandardMaterial
          color={materialColor}
          emissive={alertColor}
          emissiveIntensity={0.35}
          metalness={0.68}
          opacity={0.7}
          roughness={0.2}
          transparent
        />
      </mesh>
    );
  }

  if (node.artifact === "dossier") {
    return (
      <mesh castShadow rotation={[0.08, -0.22, -0.08]}>
        <boxGeometry args={[1.24, 1.72, 0.16, 4, 8, 2]} />
        <meshStandardMaterial
          color={materialColor}
          emissive={alertColor}
          emissiveIntensity={0.32}
          metalness={0.5}
          opacity={0.68}
          roughness={0.22}
          transparent
        />
      </mesh>
    );
  }

  if (node.artifact === "beacon") {
    return (
      <group>
        <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color={materialColor}
            emissive={alertColor}
            emissiveIntensity={0.58}
            metalness={0.5}
            opacity={0.68}
            roughness={0.16}
            transparent
          />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <coneGeometry args={[0.36, 1.4, 48, 1, true]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={node.ambient.alert}
            opacity={0.18}
            transparent
          />
        </mesh>
      </group>
    );
  }

  if (node.artifact === "scanner") {
    return (
      <mesh castShadow>
        <icosahedronGeometry args={[1.14, 4]} />
        <meshStandardMaterial
          color={materialColor}
          emissive={alertColor}
          emissiveIntensity={0.36}
          metalness={0.35}
          opacity={0.46}
          roughness={0.12}
          transparent
          wireframe
        />
      </mesh>
    );
  }

  return (
    <mesh castShadow>
      <sphereGeometry args={[1.05, 96, 96]} />
      <MeshDistortMaterial
        color={materialColor}
        distort={0.36}
        emissive={alertColor}
        emissiveIntensity={0.34}
        metalness={0.36}
        opacity={0.58}
        roughness={0.14}
        speed={1.2}
        transparent
      />
    </mesh>
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
  const isActivated = activatedNode === node.id;
  const nodeIndex = getNodeIndex(node.id);
  const activeIndex = getNodeIndex(activeNode);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const distance = Math.abs(activeIndex - nodeIndex);
    const visibility = isActive ? 1 : Math.max(0, 1 - distance * 0.82);
    const targetPosition = (isMobile ? mobileArtifactPosition : artifactPosition)
      .clone()
      .add(new Vector3((nodeIndex - activeIndex) * 0.32, Math.sin(sceneProgress * Math.PI) * 0.12, -distance * 0.38));
    const targetScale = isActive ? (hovered ? 1.48 : 1.34) + intensity * 0.1 : 0.28;

    groupRef.current.position.lerp(targetPosition, 0.06);
    groupRef.current.scale.lerp(targetScaleVector.set(targetScale, targetScale, targetScale), 0.07);
    groupRef.current.rotation.y += reducedMotion ? 0 : 0.006 + intensity * 0.012;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.32 + nodeIndex) * 0.12;
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
            isActive ? (hovered || isActivated ? 0.05 : 0.025) + transitionProgress * 0.025 : 0,
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
    setIntensity(nextHover ? 0.42 : isActivated ? 1 : 0);
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
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshBasicMaterial
          color={node.ambient.secondary}
          depthWrite={false}
          opacity={0.02}
          transparent
        />
      </mesh>
      <Float
        floatIntensity={reducedMotion ? 0 : 0.55}
        floatingRange={[-0.08, 0.12]}
        rotationIntensity={reducedMotion ? 0 : 0.28}
        speed={1.15}
      >
        <ArtifactGeometry node={node} />
        <EnergyRings active={hovered || isActivated} color={node.ambient.alert} />
      </Float>
      <pointLight
        color={node.ambient.secondary}
        distance={8}
        intensity={isActive ? 2.5 + intensity * 2.8 : 0.45}
        position={[0.8, 0.5, 1.4]}
      />
      <Sparkles
        color={node.ambient.alert}
        count={isMobile ? 34 : 64}
        opacity={isActive ? 0.64 + intensity * 0.22 : 0.12}
        scale={isActive ? 4.8 : 2.2}
        size={isActive ? 2.2 + intensity * 1.2 : 0.8}
        speed={reducedMotion ? 0 : 0.42 + intensity * 0.6}
      />
    </group>
  );
};

const SceneLighting = () => {
  const { activeNode, intensity, mode, transitionProgress } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  return (
    <>
      <ambientLight intensity={0.18 + transitionProgress * 0.08} />
      <directionalLight
        color={node.ambient.secondary}
        intensity={1.4 + intensity * 1.2}
        position={[3, 3, 4]}
      />
      <spotLight
        angle={0.45}
        color={mode === "breach" ? node.ambient.alert : node.ambient.secondary}
        intensity={3.2 + intensity * 4}
        penumbra={0.72}
        position={[-2, 3, 4.5]}
      />
    </>
  );
};

const World = ({ onNarration }: World3DSceneProps) => {
  const { activeNode, reducedMotion } = useEnvironment();
  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  const fogColor = useMemo(() => new Color(node.ambient.primary).lerp(new Color("#020107"), 0.72), [
    node.ambient.primary,
  ]);

  return (
    <>
      <color args={["#020107"]} attach="background" />
      <fog attach="fog" args={[fogColor, 7, 15]} />
      <CameraRig />
      <SceneLighting />
      <Stars
        count={reducedMotion ? 260 : 900}
        depth={36}
        factor={2.4}
        fade
        radius={42}
        saturation={0}
        speed={reducedMotion ? 0 : 0.22}
      />
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
      {/* PERF: R3F owns the world RAF loop; all meshes unmount with the Canvas and GPU resources are released by React Three Fiber. */}
      <Canvas
        camera={{ fov: isMobile ? 56 : 45, near: 0.1, position: [0.4, 0.4, 7.4] }}
        dpr={isMobile ? [0.75, 1.15] : [1, 1.5]}
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
