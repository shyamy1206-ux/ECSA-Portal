"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CircuitTraces() {
  const group = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.05;
      group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  const generateLinePoints = () => {
    const points = [];
    let x = (Math.random() - 0.5) * 20;
    let y = (Math.random() - 0.5) * 20;
    let z = (Math.random() - 0.5) * 10 - 5;
    
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3(x, y, z));
      if (Math.random() > 0.5) {
        x += (Math.random() - 0.5) * 5;
      } else {
        y += (Math.random() - 0.5) * 5;
      }
    }
    return points;
  };

  return (
    <group ref={group}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Line
          key={i}
          points={generateLinePoints()}
          color="#00f0ff"
          lineWidth={1}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

function FloatingChips() {
  const chips = Array.from({ length: 10 });
  
  return (
    <>
      {chips.map((_, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={1.5}
          floatIntensity={2}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10 - 5,
          ]}
        >
          <mesh>
            <boxGeometry args={[Math.random() * 0.5 + 0.2, Math.random() * 0.5 + 0.2, 0.05]} />
            <meshStandardMaterial 
              color="#0a0f1f" 
              emissive="#00f0ff"
              emissiveIntensity={0.2}
              wireframe={Math.random() > 0.7}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function BackgroundCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <FloatingChips />
      <CircuitTraces />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0f1f', 5, 20]} />
    </Canvas>
  );
}
