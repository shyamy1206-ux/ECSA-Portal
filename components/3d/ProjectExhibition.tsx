"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, ContactShadows, PresentationControls } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function ProjectCard({ project, onClick }: { project: any, onClick: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        hovered ? 0.5 : 0,
        0.1
      );
    }
  });

  return (
    <group ref={group} position={project.position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshStandardMaterial 
            color={hovered ? project.color : "#111827"} 
            emissive={hovered ? project.color : "#000000"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
          
          <Html transform distanceFactor={1.5} position={[0, 0, 0.06]} className="pointer-events-none">
            <div className="w-[200px] h-[280px] p-6 text-white bg-navy-900/80 backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-between"
                 style={{ boxShadow: hovered ? `0 0 20px ${project.color}40` : 'none' }}>
              <div>
                <h3 className="text-xl font-bold font-heading mb-2 leading-tight">{project.title}</h3>
                <p className="text-xs text-gray-400 font-mono">
                  {project.tech_stack ? project.tech_stack.join(', ') : 'Tech Stack TBA'}
                </p>
              </div>
              <div className="mt-auto">
                <span className="text-xs uppercase tracking-wider text-electric-cyan font-bold">View Details</span>
              </div>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
}

export default function ProjectExhibition({ projects }: { projects: any[] }) {
  const [activeProject, setActiveProject] = useState<any | null>(null);

  // Map real projects to 3D positions if they don't have them
  const mappedProjects = projects.map((proj, idx) => {
    // Simple logic to space them out in a circle/grid
    const x = (idx % 3 - 1) * 3;
    const z = Math.floor(idx / 3) * -3;
    const colors = ["#00f0ff", "#ff00ff", "#8a2be2", "#4ade80", "#facc15"];
    return {
      ...proj,
      position: [x, 0, z],
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="w-full h-[80vh] relative">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          {mappedProjects.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              project={proj} 
              onClick={() => setActiveProject(proj)} 
            />
          ))}
          
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#00ffff" />
        </PresentationControls>
      </Canvas>

      {/* Framer Motion Modal for active project */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-lg"
          >
            <motion.div 
              layoutId={`project-${activeProject.id}`}
              className="glass max-w-2xl w-full p-8 rounded-2xl relative border-t border-t-electric-cyan/50"
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <h2 className="text-3xl font-heading font-bold mb-2 text-white">{activeProject.title}</h2>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-cyan text-xs font-mono">{activeProject.tech}</span>
              </div>
              
              <p className="text-gray-300 text-lg mb-8">
                {activeProject.description}
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium">View GitHub</a>
                <a href="#" className="px-6 py-2 bg-electric-blue text-navy-900 hover:bg-electric-cyan rounded-lg transition-colors font-bold">Live Demo</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm animate-pulse pointer-events-none">
        Drag to explore exhibition • Click to expand
      </div>
    </div>
  );
}
