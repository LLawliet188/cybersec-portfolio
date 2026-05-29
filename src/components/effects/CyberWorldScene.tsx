import { memo, useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  Color,
  ConeGeometry,
  Fog,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";

type CyberWorldSceneProps = {
  className?: string;
};

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const CyberWorldSceneComponent = ({ className = "" }: CyberWorldSceneProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !isWebGLAvailable()) {
      setShowFallback(true);
      return;
    }

    setShowFallback(false);

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.5));
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "h-full w-full";

    const scene = new Scene();
    scene.fog = new Fog(new Color("#05040A"), 8, 18);

    const camera = new PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 1.1, 8.3);

    const world = new Group();
    scene.add(world);

    const orbGeometry = new IcosahedronGeometry(1.28, 6);
    const orbMaterial = new MeshPhysicalMaterial({
      color: new Color("#4F46E5"),
      emissive: new Color("#A855F7"),
      emissiveIntensity: 0.42,
      metalness: 0.12,
      roughness: 0.34,
      transmission: 0.18,
      thickness: 1,
      transparent: true,
      opacity: 0.82,
    });
    const orb = new Mesh(orbGeometry, orbMaterial);
    orb.position.set(0.35, 0.7, 0);
    world.add(orb);

    const orbWire = new Mesh(
      orbGeometry.clone(),
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        color: "#38BDF8",
        opacity: 0.16,
        transparent: true,
        wireframe: true,
      }),
    );
    orb.add(orbWire);

    const terrainGeometry = new PlaneGeometry(11.5, 7, 80, 48);
    const positions = terrainGeometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const ripple =
        Math.sin(x * 1.2) * 0.2 +
        Math.cos(y * 1.6) * 0.18 +
        Math.sin((x + y) * 0.9) * 0.14;
      positions.setZ(index, ripple);
    }
    terrainGeometry.computeVertexNormals();

    const terrain = new Mesh(
      terrainGeometry,
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        color: "#A855F7",
        opacity: 0.2,
        transparent: true,
        wireframe: true,
      }),
    );
    terrain.rotation.x = -Math.PI / 2.25;
    terrain.position.set(0.2, -1.35, -1.4);
    world.add(terrain);

    const crystals = new Group();
    const crystalGeometry = new ConeGeometry(0.08, 0.7, 5);
    const crystalMaterial = new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: "#38BDF8",
      opacity: 0.68,
      transparent: true,
    });
    const crystalPositions = [
      [-2.7, -1.03, -0.6],
      [-1.9, -0.92, 0.2],
      [-1.1, -0.86, -0.9],
      [1.55, -0.9, -0.4],
      [2.3, -0.98, 0.3],
      [3.05, -1.05, -0.85],
    ];
    crystalPositions.forEach(([x, y, z], index) => {
      const crystal = new Mesh(crystalGeometry, crystalMaterial);
      crystal.position.set(x, y, z);
      crystal.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.18;
      crystal.scale.setScalar(index % 3 === 0 ? 1.35 : 1);
      crystals.add(crystal);
    });
    world.add(crystals);

    scene.add(new AmbientLight("#7C3AED", 1.1));
    const blueLight = new PointLight("#38BDF8", 8, 12);
    blueLight.position.set(-3, 1.6, 2.8);
    scene.add(blueLight);
    const roseLight = new PointLight("#FB7185", 6, 12);
    roseLight.position.set(2.8, 1.2, 1.8);
    scene.add(roseLight);

    const mouse = new Vector2(0, 0);
    let frameId = 0;
    const startedAt = performance.now();

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const render = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      orb.rotation.x = elapsed * 0.07 + mouse.y * 0.08;
      orb.rotation.y = elapsed * 0.12 + mouse.x * 0.12;
      orb.position.y = 0.72 + Math.sin(elapsed * 0.8) * 0.08;
      terrain.rotation.z = Math.sin(elapsed * 0.16) * 0.02;
      crystals.children.forEach((crystal, index) => {
        crystal.position.y =
          crystalPositions[index][1] + Math.sin(elapsed * 1.3 + index) * 0.08;
      });
      camera.position.x += (mouse.x * 0.28 - camera.position.x) * 0.02;
      camera.position.y += (1.1 + mouse.y * -0.16 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();

    return () => {
      // PERF: The Three.js scene owns one RAF loop, a ResizeObserver, and GPU resources; all are cleaned up on unmount.
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      orbGeometry.dispose();
      orbWire.geometry.dispose();
      orbMaterial.dispose();
      (orbWire.material as MeshBasicMaterial).dispose();
      terrainGeometry.dispose();
      (terrain.material as MeshBasicMaterial).dispose();
      crystalGeometry.dispose();
      crystalMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      ref={containerRef}
    >
      {showFallback ? (
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet/30 blur-[90px]" />
      ) : null}
    </div>
  );
};

export const CyberWorldScene = memo(CyberWorldSceneComponent);
