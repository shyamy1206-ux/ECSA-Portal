import { createStaticClient } from "@/lib/supabase/static";
import dynamic from "next/dynamic";
import { FolderGit2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const ProjectExhibition = dynamic(() => import("@/components/3d/ProjectExhibition"), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-electric-blue">Loading 3D Exhibition...</div>
});

export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = createStaticClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .eq('status', 'published');

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
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <EmptyState 
              title="No records available yet."
              description="Student projects are currently under review by the ECSA board. Check back soon for the official showcase."
              icon={<FolderGit2 size={32} />}
              className="border-none bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}


