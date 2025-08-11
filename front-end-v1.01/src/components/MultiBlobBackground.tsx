"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Blob from "./Blob";

// Multiple non-interactive animated blobs rendered behind content.
// Uses additive colors and subtle blending.

const MultiBlobBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 1.1;
          // @ts-expect-error adjust renderer settings for newer three versions
          gl.useLegacyLights = false;
          scene.fog = new THREE.Fog("#0c0c1d", 6, 16);
        }}
      >
        <color attach="background" args={["#0c0c1d"]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-4, -2, -3]}
          intensity={0.7}
          color={"#B026FF"}
        />
        <spotLight
          position={[0, 4, 6]}
          angle={0.6}
          penumbra={0.7}
          intensity={1.1}
          color="#00F5FF"
          castShadow
        />
        <Suspense fallback={null}>
          <group>
            <Blob
              radius={3.2}
              detail={40}
              color="#080014"
              emissive="#B026FF"
              emissiveIntensity={1.15}
              amplitude={0.36}
              speed={0.11}
              wobbleSpeed={0.5}
              position={[0, -0.2, -3.5]}
              opacity={1}
              phase={0}
            />
            <Blob
              radius={2.3}
              detail={34}
              color="#00141a"
              emissive="#00F5FF"
              emissiveIntensity={1.9}
              amplitude={0.32}
              speed={0.19}
              wobbleSpeed={0.74}
              position={[-3.4, 1.5, -4.2]}
              opacity={1}
              phase={1.3}
            />
            <Blob
              radius={1.9}
              detail={34}
              color="#000d17"
              emissive="#8A2FD8"
              emissiveIntensity={1.4}
              amplitude={0.27}
              speed={0.17}
              wobbleSpeed={0.64}
              position={[3.2, -1.7, -0.4]}
              opacity={1}
              phase={2.2}
            />
            <Blob
              radius={1.2}
              detail={26}
              color="#020b11"
              emissive="#00F5FF"
              emissiveIntensity={1.6}
              amplitude={0.34}
              speed={0.28}
              wobbleSpeed={0.9}
              position={[1.6, 2.2, -3.8]}
              opacity={1}
              phase={3.4}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MultiBlobBackground;
