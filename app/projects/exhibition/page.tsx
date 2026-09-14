import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamically import the Three.js scene with SSR disabled to prevent Node.js canvas crashes
const ExhibitionScene = dynamic(() => import("@/components/ui/ExhibitionScene"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
      <div className="text-electric-cyan flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm tracking-widest uppercase">Initializing 3D Engine...</p>
      </div>
    </div>
  )
});

export const revalidate = 60;

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto pb-20 flex flex-col">
      <div className="mb-8">
        <Link href="/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Virtual <span className="text-electric-blue">Exhibition</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Explore top student projects from the technical festival in our interactive 3D gallery.
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="flex-1 min-h-[600px] w-full relative">
        <ExhibitionScene />
      </div>
    </div>
  );
}
