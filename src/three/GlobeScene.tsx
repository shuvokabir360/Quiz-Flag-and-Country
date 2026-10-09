import { useRef, useMemo, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobeFallback } from './GlobeFallback';

// Procedurally generate a crisp Earth-like texture map without external network assets
function createEarthCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Ocean background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a1d47');
  oceanGrad.addColorStop(0.5, '#071638');
  oceanGrad.addColorStop(1, '#0a1d47');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Stylized continents (vibrant emerald & teal geo-shapes)
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  // Eurasia / Africa
  ctx.ellipse(560, 220, 180, 110, 0.2, 0, Math.PI * 2);
  ctx.ellipse(500, 320, 120, 130, -0.2, 0, Math.PI * 2);
  // Americas
  ctx.ellipse(250, 190, 110, 100, -0.1, 0, Math.PI * 2);
  ctx.ellipse(320, 350, 80, 120, 0.3, 0, Math.PI * 2);
  // Australia
  ctx.ellipse(780, 360, 70, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle longitude / latitude lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  return canvas;
}

const EarthSphere: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    const canvas = createEarthCanvas();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  useFrame((_, delta) => {
    const speed = reducedMotion ? 0.04 : 0.2;
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * speed;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * (speed * 1.1);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (speed * 0.5);
    }
  });

  return (
    <group position={[0, -0.2, -1.8]}>
      {/* Main Realistic Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.65}
          metalness={0.15}
          emissive="#0d2b5c"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Atmospheric Soft Cloud / Glow Outer Shell */}
      <mesh ref={atmosphereRef} scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1.55, 36, 36]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbiting Tech Ring */}
      <group ref={ringRef} rotation={[1.1, 0.4, 0]}>
        <mesh>
          <ringGeometry args={[1.85, 1.88, 64]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

const FloatingParticles: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38bdf8"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('WebGL / Three.js error caught, switching to fallback:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const GlobeScene: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  return (
    <WebGLErrorBoundary fallback={<GlobeFallback />}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 5, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-4, -3, -2]} intensity={1.2} color="#0284c7" />

          {/* 3D Objects */}
          <EarthSphere reducedMotion={reducedMotion} />
          <FloatingParticles count={50} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};
