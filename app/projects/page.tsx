import ProjectExhibition from "@/components/3d/ProjectExhibition";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col">
      <div className="mb-8 relative z-10 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Innovation Showcase</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Explore cutting-edge projects built by ECSA students. Drag the 3D space to pan around the exhibition hall, and click any project for details.
        </p>
      </div>

      <div className="flex-1 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/40">
        <ProjectExhibition />
      </div>
    </div>
  );
}
