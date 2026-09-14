import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, FolderGit2 } from "lucide-react";
import { JoinProjectButton } from "@/components/projects/JoinProjectButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function DiscoverProjectsPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // Fetch published projects
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        user_id, status
      ),
      profiles(full_name)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Link href="/app/projects" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to My Projects
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Discover Teams</h1>
        <p className="text-gray-400">Find exciting campus projects looking for collaborators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((proj: any) => {
            const memberCount = proj.project_members?.filter((m: any) => m.status === 'approved').length || 0;
            const myStatus = proj.project_members?.find((m: any) => m.user_id === session.user.id)?.status;
            
            return (
              <div key={proj.id} className="glass p-6 rounded-3xl border border-white/10 flex flex-col h-full">
                <h3 className="font-bold text-xl text-white mb-2">{proj.title}</h3>
                <p className="text-sm text-electric-cyan mb-4">Led by {proj.profiles?.full_name}</p>
                <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">{proj.summary || proj.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tech_stack?.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                  {(proj.tech_stack?.length || 0) > 3 && <span className="px-2 py-1 rounded bg-black/40 border border-white/5 text-xs text-gray-500">+{proj.tech_stack.length - 3}</span>}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={14} /> {memberCount} {memberCount === 1 ? 'member' : 'members'}
                  </div>
                  
                  {myStatus === 'approved' ? (
                    <span className="text-xs font-bold text-green-400">Already a Member</span>
                  ) : myStatus === 'pending' ? (
                    <span className="text-xs font-bold text-yellow-400">Request Pending</span>
                  ) : myStatus === 'rejected' ? (
                    <span className="text-xs font-bold text-red-400">Request Declined</span>
                  ) : (
                    <JoinProjectButton projectId={proj.id} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState 
              title="No Projects Available"
              description="There are currently no published projects looking for members. Check back later!"
              icon={<FolderGit2 size={40} />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
