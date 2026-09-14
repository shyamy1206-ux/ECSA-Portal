"use client";

import { Cpu, CircuitBoard, Server, Fingerprint } from "lucide-react";
import { useActiveStorySection } from "./ScrollStoryContext";

export function ScrollStoryFallback() {
  const { activeChapter } = useActiveStorySection();

  const getIcon = () => {
    switch (activeChapter) {
      case "academics": return <CircuitBoard size={120} />;
      case "labs": return <Server size={120} />;
      case "projects": return <Fingerprint size={120} />;
      default: return <Cpu size={120} />;
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#05070A] flex flex-col items-center justify-center pointer-events-none transition-colors duration-1000">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-electric-blue via-[#05070A] to-[#05070A] transition-all duration-1000"></div>
      
      <div className="z-10 text-electric-blue/20 transition-all duration-1000 transform scale-150">
        {getIcon()}
      </div>
    </div>
  );
}
