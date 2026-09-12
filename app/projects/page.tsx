import { createClient } from "@/lib/supabase/server";
import ProjectExhibition from "@/components/3d/ProjectExhibition";
import { FolderGit2 } from "lucide-react";

export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = createClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .eq('status', 'approved');

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col">
      <div className="mb-8 relative z-10 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Innovation Showcase</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Explore cutting-edge projects built by ECSA students. Drag the 3D space to pan around the exhibition hall, and click any project for details.
        </p>
      </div>

      <div className="flex-1 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative">
        {projects && projects.length > 0 ? (
          <ProjectExhibition projects={projects} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/60 backdrop-blur-sm z-20">
            <FolderGit2 size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">The Exhibition is Empty</h3>
            <p className="text-gray-400 max-w-md">Student projects are currently under review by the ECSA board. Check back soon for the official showcase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
