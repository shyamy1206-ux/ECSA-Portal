"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// A single project cube component
function ProjectCube({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} wireframe={false} metalness={0.5} roughness={0.2} />
      </mesh>
      <Text 
        position={[0, -1, 0]} 
        fontSize={0.2} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Scene with a rotating grid of cubes
export default function ExhibitionScene() {
  const projects = [
    { id: 1, pos: [-2, 0, 0] as [number, number, number], color: "#00E5FF", label: "AI Robot" },
    { id: 2, pos: [0, 0, 0] as [number, number, number], color: "#FF00FF", label: "Web3 App" },
    { id: 3, pos: [2, 0, 0] as [number, number, number], color: "#00FF00", label: "Drone Tech" },
    { id: 4, pos: [-1, 2, -1] as [number, number, number], color: "#FFFF00", label: "Smart Home" },
    { id: 5, pos: [1, 2, -1] as [number, number, number], color: "#FF8800", label: "VR Game" },
  ];

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-black/50 border border-white/10 relative cursor-move">
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00E5FF" />
        
        {projects.map((p) => (
          <ProjectCube key={p.id} position={p.pos} color={p.color} label={p.label} />
        ))}
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-gray-400 text-sm bg-black/60 inline-block px-4 py-1.5 rounded-full border border-white/10">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
