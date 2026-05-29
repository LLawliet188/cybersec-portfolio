import { memo, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from "three";
import { missionNodes } from "./missionContent";
import { useEnvironment } from "./EnvironmentProvider";

const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 520 : 1200;

const ParticleField = () => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const { activeNode, intensity, mode, progress } = useEnvironment();
  const geometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 18;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    const nextGeometry = new BufferGeometry();
    nextGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    return nextGeometry;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const node = missionNodes.find((item) => item.id === activeNode) ?? missionNodes[0];

  useFrame(({ clock, camera }) => {
    const elapsed = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * (0.018 + intensity * 0.04) + progress * 0.8;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.14) * 0.08;
      pointsRef.current.position.z = -1.5 + Math.sin(progress * Math.PI) * 0.8;
    }

    if (materialRef.current) {
      materialRef.current.color.lerp(new Color(node.ambient.secondary), 0.035);
      materialRef.current.opacity =
        mode === "idle" ? 0.24 : mode === "breach" ? 0.54 + intensity * 0.28 : 0.34 + intensity * 0.22;
      materialRef.current.size = mode === "breach" ? 0.032 + intensity * 0.018 : 0.024 + intensity * 0.012;
    }

    camera.position.z = 7.8 - intensity * 0.55;
    camera.position.x = Math.sin(progress * Math.PI * 2) * 0.4;
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        color={node.ambient.secondary}
        depthWrite={false}
        opacity={0.3}
        size={0.024}
        transparent
      />
    </points>
  );
};

const ParticleEngineComponent = () => {
  const { reducedMotion } = useEnvironment();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-30 scanline-mask"
      />
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-80">
      {/* PERF: React Three Fiber owns the RAF loop here; unmount cleanup stops the canvas and disposes geometry. */}
      <Canvas
        camera={{ fov: 48, position: [0, 0, 8] }}
        dpr={isMobile ? [0.75, 1.1] : [1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export const ParticleEngine = memo(ParticleEngineComponent);
