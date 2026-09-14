import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FolderGit2, Plus, Users, Globe, Github } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function StudentProjectsPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // Fetch projects user created OR is a member of
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        id, role, status,
        profiles(full_name, avatar_url)
      )
    `)
    .or(`created_by.eq.${session.user.id},id.in.(select project_id from project_members where user_id = '${session.user.id}')`);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">My Projects</h1>
          <p className="text-gray-400">Manage your project portfolio and collaborate with teammates.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/app/projects/discover" 
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            <Globe size={18} /> Discover
          </Link>
          <Link 
            href="/app/projects/new" 
            className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors"
          >
            <Plus size={18} /> New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((proj: any) => {
            const isOwner = proj.created_by === session.user.id;
            const myMembership = proj.project_members?.find((m: any) => m.profiles?.full_name); // Simplified check
            const members = proj.project_members?.filter((m: any) => m.status === 'approved') || [];

            return (
              <div key={proj.id} className="glass p-6 rounded-3xl border border-white/10 hover:border-electric-blue/50 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    proj.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    proj.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-white/10 text-gray-400'
                  }`}>
                    {proj.status}
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-electric-violet/20 text-electric-violet">
                      Owner
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-xl text-white mb-2">{proj.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{proj.summary || proj.description || 'No description provided.'}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tech_stack?.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                  {(proj.tech_stack?.length || 0) > 3 && <span className="px-2 py-1 rounded bg-black/40 border border-white/5 text-xs text-gray-500">+{proj.tech_stack.length - 3}</span>}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={14} /> {members.length} {members.length === 1 ? 'member' : 'members'}
                  </div>
                  <div className="flex gap-2">
                    {proj.github_url && (
                      <Link href={proj.github_url} target="_blank" className="text-gray-400 hover:text-white"><Github size={16}/></Link>
                    )}
                    {proj.live_url && (
                      <Link href={proj.live_url} target="_blank" className="text-gray-400 hover:text-electric-cyan"><Globe size={16}/></Link>
                    )}
                  </div>
                </div>

                <Link href={`/app/projects/${proj.id}`} className="absolute inset-0 z-0">
                  <span className="sr-only">View Project</span>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState 
              title="No Projects Found"
              description="You haven't created or joined any projects yet. Start building your ECSA portfolio today!"
              icon={<FolderGit2 size={40} />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
