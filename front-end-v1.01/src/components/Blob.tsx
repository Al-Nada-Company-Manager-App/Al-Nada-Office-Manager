"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export interface BlobProps {
  radius?: number; // base radius of the icosahedron
  detail?: number; // subdivision detail
  color?: string; // base color
  emissive?: string; // emissive glow color
  emissiveIntensity?: number; // emissive intensity
  amplitude?: number; // deformation amplitude
  speed?: number; // rotation speed multiplier
  wobbleSpeed?: number; // deformation time speed
  position?: [number, number, number];
  opacity?: number; // material opacity
  wireframe?: boolean; // optional wireframe
  pulse?: boolean; // subtle scale pulsing
  pulseAmp?: number; // amplitude of scale pulse
  phase?: number; // phase offset for independent motion
}

export default function Blob({
  radius = 2.5,
  detail = 20,
  color = "#000000",
  emissive = "#6B00B6",
  emissiveIntensity = 1.5,
  amplitude = 0.25,
  speed = 0.15,
  wobbleSpeed = 0.5,
  position = [0, 0, 0],
  opacity = 1,
  wireframe = false,
  pulse = true,
  pulseAmp = 0.035,
  phase = 0,
}: BlobProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Create geometry once
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(radius, detail),
    [radius, detail]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y = t * speed;
    mesh.rotation.x = t * (speed * 0.4);
    if (pulse) {
      const s = 1 + Math.sin(t * 0.8 + phase) * pulseAmp;
      mesh.scale.setScalar(s);
    }

    const geo = mesh.geometry as THREE.IcosahedronGeometry;
    const positionAttr = geo.attributes.position as THREE.BufferAttribute;
    const vertex = new THREE.Vector3();
    const baseRadius: number = (geo.parameters as { radius: number }).radius;
    const time = t * wobbleSpeed;

    for (let i = 0; i < positionAttr.count; i++) {
      vertex.fromBufferAttribute(positionAttr, i);
      vertex
        .normalize()
        .multiplyScalar(
          baseRadius +
            amplitude *
              Math.sin(vertex.x * 4 + time) *
              Math.cos(vertex.y * 4 + time)
        );
      positionAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttr.needsUpdate = true;
    // Recompute normals for proper dynamic lighting giving stronger 3D appearance
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={0.3}
        roughness={0.45}
        transparent={opacity < 1}
        opacity={opacity}
        wireframe={wireframe}
      />
    </mesh>
  );
}
