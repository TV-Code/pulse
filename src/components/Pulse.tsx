import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Vector3, DoubleSide } from 'three';
import { Billboard } from '@react-three/drei';

interface PulseProps {
  position: [number, number, number];
  bpm: number;
  timestamp: number;
}

export function Pulse({ position, bpm, timestamp }: PulseProps) {
  const ringRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  
  const positionVector = new Vector3(...position);
  const normalizedPosition = positionVector.normalize();
  const raisedPosition = normalizedPosition.multiplyScalar(1.08); // Lowered from 1.15
  
  const frequency = bpm / 60;
  
  useFrame(({ clock }) => {
    if (!materialRef.current || !ringRef.current || !coreRef.current) return;
    
    const t = clock.getElapsedTime();
    const pulsePhase = (Math.sin(t * Math.PI * frequency) + 1) / 2;
    
    // Animate core
    const baseScale = 0.04;
    const pulseScale = baseScale * (1 + pulsePhase * 0.2);
    coreRef.current.scale.setScalar(pulseScale);
    
    materialRef.current.uniforms.time.value = t;
    materialRef.current.uniforms.pulsePhase.value = pulsePhase;
  });

  return (
    <group position={raisedPosition.toArray()}>
      {/* Core bright point */}
      <Billboard>
        <mesh ref={coreRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#FF4444" toneMapped={false} />
        </mesh>
        
        {/* Outer ring effect - now part of the Billboard group */}
        <mesh ref={ringRef}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={materialRef}
            side={DoubleSide}
            transparent
            uniforms={{
              time: { value: 0 },
              pulsePhase: { value: 0 },
            }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                vec3 pos = position;
                pos.xy *= 0.3;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `}
            fragmentShader={`
              uniform float time;
              uniform float pulsePhase;
              varying vec2 vUv;

              void main() {
                vec2 center = vUv * 2.0 - 1.0;
                float dist = length(center);
                
                // Create sharp ring effect
                float ring = smoothstep(0.5, 0.48, dist) * smoothstep(0.0, 0.2, dist);
                
                // Pulse wave effect
                float wave = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
                wave *= smoothstep(1.0, 0.0, dist);
                
                // Combine effects with pulse phase
                float brightness = ring * (wave * 0.3 + 0.7) * pulsePhase;
                
                // Hot red-orange color
                vec3 color = vec3(1.0, 0.2, 0.1) * brightness * 1.5;
                
                gl_FragColor = vec4(color, brightness);
              }
            `}
          />
        </mesh>
      </Billboard>
    </group>
  );
}