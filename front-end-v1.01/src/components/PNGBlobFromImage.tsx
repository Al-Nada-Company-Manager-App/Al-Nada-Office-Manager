"use client";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";

/*
  PNGBlobFromImage
  Demonstrates TWO techniques using a provided PNG (with colored rim on black background):
  1. DisplacementMesh: High‑subdiv plane displaced along its normal using the PNG luminance (treating bright rim as raised edge). Interior stays lower (dark).
  2. AlphaBillboard: A flat plane that derives alpha + rim glow from the texture so only the colored ring shows (black center becomes transparent).

  Usage:
    <PNGBlobFromImage src="/blobCluster.png" mode="displace" />
    <PNGBlobFromImage src="/blobCluster.png" mode="alpha" />

  Place your PNG inside `public/` (e.g. public/blobCluster.png) so Next.js serves it at /blobCluster.png.
*/

export interface PNGBlobFromImageProps {
  src: string; // path to PNG in public
  mode?: "displace" | "alpha" | "raw"; // add raw => show image exactly
  size?: number; // plane size in world units
  subdivisions?: number; // plane segments (displacement only)
  displacementScale?: number; // max extrusion height
  rotationSpeed?: number; // slow rotation for some life
  pulse?: boolean;
  pulseAmp?: number;
  rimGlow?: number; // extra glow intensity for alpha mode
  threshold?: number; // color length threshold to start rim
  opaque?: boolean; // if true, keep full PNG (no transparency/discard)
  rawBillboard?: boolean; // only for mode raw: face camera
  rawTransparent?: boolean; // allow PNG intrinsic alpha if it has one
}

const PNGBlobFromImage = ({
  src,
  mode = "displace",
  size = 5,
  subdivisions = 256,
  displacementScale = 1.2,
  rotationSpeed = 0.05,
  pulse = true,
  pulseAmp = 0.03,
  rimGlow = 1.6,
  threshold = 0.08,
  opaque = false,
  rawBillboard = false,
  rawTransparent = false,
}: PNGBlobFromImageProps) => {
  const tex = useLoader(THREE.TextureLoader, src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <group>
      {/* Background Glow Effects */}
      <BackgroundGlows />

      {/* Main Blob */}
      {mode === "raw" ? (
        <RawPlane
          texture={tex}
          size={size}
          billboard={rawBillboard}
          rotationSpeed={rotationSpeed}
          pulse={pulse}
          pulseAmp={pulseAmp}
          transparent={rawTransparent}
        />
      ) : mode === "alpha" ? (
        <AlphaBillboard
          texture={tex}
          size={size}
          rotationSpeed={rotationSpeed}
          pulse={pulse}
          pulseAmp={pulseAmp}
          rimGlow={rimGlow}
          threshold={threshold}
          opaque={opaque}
        />
      ) : (
        <DisplacementMesh
          texture={tex}
          size={size}
          subdivisions={subdivisions}
          displacementScale={displacementScale}
          rotationSpeed={rotationSpeed}
          pulse={pulse}
          pulseAmp={pulseAmp}
          opaque={opaque}
        />
      )}
    </group>
  );
};

// 1. Displacement approach --------------------------------------------------
interface DisplacementMeshProps {
  texture: THREE.Texture;
  size: number;
  subdivisions: number;
  displacementScale: number;
  rotationSpeed: number;
  pulse: boolean;
  pulseAmp: number;
  opaque: boolean;
}

const DisplacementMesh = ({
  texture,
  size,
  subdivisions,
  displacementScale,
  rotationSpeed,
  pulse,
  pulseAmp,
  opaque,
}: DisplacementMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geom = useMemo(
    () => new THREE.PlaneGeometry(size, size, subdivisions, subdivisions),
    [size, subdivisions]
  );

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDispScale: { value: displacementScale },
      uTime: { value: 0 },
      uOpaque: { value: opaque ? 1.0 : 0.0 },
    }),
    [texture, displacementScale, opaque]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * rotationSpeed;
      meshRef.current.rotation.x = t * rotationSpeed * 0.3;
      if (pulse) {
        const s = 1 + Math.sin(t * 0.8) * pulseAmp;
        meshRef.current.scale.setScalar(s);
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={displaceVertex}
        fragmentShader={displaceFragment}
        uniforms={uniforms}
        transparent
        depthWrite
      />
    </mesh>
  );
};

const displaceVertex = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uDispScale;
  uniform float uTime;
  uniform float uOpaque;
  varying vec2 vUv;
  varying float vMask;

  // Convert texture color to luminance (simple average) for displacement
  float luminance(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }

  void main(){
    vUv = uv;
    vec4 tex = texture2D(uMap, uv);
    float l = luminance(tex.rgb);
    // We treat bright rim as higher, dark interior lower (slight offset so interior not piercing below plane)
    float h = (l) * uDispScale;
    // Optional subtle breathing could be added: h += 0.02*sin(uTime*0.5 + uv.x*4.0);
    vec3 displaced = position + normal * h;

    // Recompute approximate normal via derivatives for better lighting in fragment? (done there)
    vMask = l; // pass to fragment for shading mask
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const displaceFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying float vMask;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpaque;

  void main(){
    vec4 tex = texture2D(uMap, vUv);
  float a = uOpaque > 0.5 ? 1.0 : smoothstep(0.03, 0.25, vMask); // alpha from luminance unless opaque
  if(uOpaque < 0.5 && a < 0.01) discard;
    // Color: use texture but slightly intensify vibrant edges
    vec3 col = tex.rgb * (1.0 + 0.6 * pow(vMask, 1.8));
    // Extra glow boost near brightest zones (outer rim)
    float glow = smoothstep(0.55, 0.95, vMask);
    col += vec3(0.25,0.4,0.9) * glow * 0.35;
    // Soft tone map
    col = col / (col + vec3(1.0));
    gl_FragColor = vec4(col, a);
  }
`;

// 2. Alpha billboard approach ----------------------------------------------
interface AlphaBillboardProps {
  texture: THREE.Texture;
  size: number;
  rotationSpeed: number;
  pulse: boolean;
  pulseAmp: number;
  rimGlow: number;
  threshold: number;
  opaque: boolean;
}

const AlphaBillboard = ({
  texture,
  size,
  rotationSpeed,
  pulse,
  pulseAmp,
  rimGlow,
  threshold,
  opaque,
}: AlphaBillboardProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geom = useMemo(() => new THREE.PlaneGeometry(size, size, 2, 2), [size]);
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uGlow: { value: rimGlow },
      uThreshold: { value: threshold },
      uOpaque: { value: opaque ? 1.0 : 0.0 },
    }),
    [texture, rimGlow, threshold, opaque]
  );

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
    if (meshRef.current) {
      // Face camera (billboard)
      meshRef.current.quaternion.copy(camera.quaternion);
      if (pulse) {
        const s = 1 + Math.sin(t * 0.9) * pulseAmp;
        meshRef.current.scale.setScalar(s);
      }
      // Optional slow yaw for subtle motion
      meshRef.current.rotation.z += rotationSpeed * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[0, 0, 0]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={alphaVertex}
        fragmentShader={alphaFragment}
        uniforms={uniforms}
        transparent={!opaque}
        depthWrite={opaque}
        blending={opaque ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const alphaVertex = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const alphaFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uGlow;
  uniform float uThreshold;
  uniform float uTime;
  uniform float uOpaque;

  float luminance(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }

  void main(){
    vec4 tex = texture2D(uMap, vUv);
    float l = luminance(tex.rgb);
  // Derive alpha unless opaque: keep only rim (bright colors). interior near black -> transparent.
  float a = uOpaque > 0.5 ? 1.0 : smoothstep(uThreshold, uThreshold + 0.15, l);
  if(uOpaque < 0.5 && a < 0.01) discard;
    // Edge enhancement: approximate edge strength via local contrast (sample neighbors)
    vec2 px = vec2(1.0/1024.0, 0.0); // assuming up to 1024px; adjust if needed
    vec2 py = vec2(0.0, 1.0/1024.0);
    float lRight = luminance(texture2D(uMap, vUv+px).rgb);
    float lLeft  = luminance(texture2D(uMap, vUv-px).rgb);
    float lUp    = luminance(texture2D(uMap, vUv+py).rgb);
    float lDown  = luminance(texture2D(uMap, vUv-py).rgb);
    float edge = clamp((abs(lRight-lLeft)+abs(lUp-lDown))*1.2,0.0,1.0);

    vec3 baseCol = tex.rgb;
    // Glow pulse
    float pulse = 1.0 + 0.25*sin(uTime*0.7);
    vec3 glowCol = baseCol * (uGlow * edge * pulse);
    vec3 col = baseCol + glowCol;
    col = col / (col + vec3(1.0));
    gl_FragColor = vec4(col, a);
  }
`;

export default PNGBlobFromImage;

// 3. Raw plane (no modification) ------------------------------------------
interface RawPlaneProps {
  texture: THREE.Texture;
  size: number;
  billboard: boolean;
  rotationSpeed: number;
  pulse: boolean;
  pulseAmp: number;
  transparent: boolean;
}

const RawPlane = ({
  texture,
  size,
  billboard,
  rotationSpeed,
  pulse,
  pulseAmp,
  transparent,
}: RawPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;
    if (billboard) meshRef.current.quaternion.copy(camera.quaternion);
    else meshRef.current.rotation.y = t * rotationSpeed * 0.2;
    if (pulse) {
      const s = 1 + Math.sin(t * 0.8) * pulseAmp;
      meshRef.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size, size, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent={transparent}
        toneMapped={false}
      />
    </mesh>
  );
};

// 4. Background Glow Effects Component ------------------------------------
const BackgroundGlows = () => {
  const purpleGlowRef = useRef<THREE.Mesh>(null!);
  const blueGlowRef = useRef<THREE.Mesh>(null!);

  const purpleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(173 / 255, 0, 255 / 255) },
      uOpacity: { value: 0.6 }, // Increased visibility
    }),
    []
  );

  const blueUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(29 / 255, 76 / 255, 167 / 255) },
      uOpacity: { value: 0.5 }, // Increased visibility
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (purpleGlowRef.current && purpleGlowRef.current.material) {
      const material = purpleGlowRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = t;
    }
    if (blueGlowRef.current && blueGlowRef.current.material) {
      const material = blueGlowRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = t;
    }
  });

  return (
    <group>
      {/* Purple Glow - positioned right/top */}
      <mesh
        ref={purpleGlowRef}
        position={[8, 3, -4]} // Better positioning for 3D space
      >
        <planeGeometry args={[16, 16, 32, 32]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={purpleUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Blue Glow - positioned left/top */}
      <mesh
        ref={blueGlowRef}
        position={[-6, 2, -4.1]} // Better positioning for 3D space
      >
        <planeGeometry args={[14, 14, 32, 32]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={blueUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const glowVertex = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Create stronger radial gradient with better falloff
    float radius = 0.6;
    float softness = 0.8;
    float alpha = 1.0 - smoothstep(0.0, radius * softness, dist);
    
    // Make the glow stronger in the center
    alpha = pow(alpha, 0.5);
    
    // Subtle breathing animation
    alpha *= 1.0 + 0.15 * sin(uTime * 0.3);
    
    // Increase overall intensity
    alpha *= 2.0;
    
    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;
