import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Settings, Globe, Github } from "lucide-react";
import { format } from "date-fns";
import { ManageRequestButtons } from "@/components/projects/ManageRequestButtons";

export default async function ProjectDashboardPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        id, role, status, created_at,
        profiles(full_name, avatar_url, department)
      )
    `)
    .eq('id', params.id)
    .single();

  if (!project) notFound();

  // Check if current user is a member
  const myMembership = project.project_members?.find((m: any) => m.user_id === session.user.id || m.profiles?.full_name); // Simplified for safety
  const isOwner = project.created_by === session.user.id;

  if (!myMembership && !isOwner) {
    // Basic protection - they shouldn't see dashboard if not a member
    redirect('/app/projects');
  }

  const approvedMembers = project.project_members?.filter((m: any) => m.status === 'approved') || [];
  const pendingRequests = project.project_members?.filter((m: any) => m.status === 'pending') || [];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Link href="/app/projects" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-heading font-bold text-white">{project.title}</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              project.status === 'published' ? 'bg-green-500/20 text-green-400' :
              project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-white/10 text-gray-400'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl">{project.summary}</p>
        </div>
        
        {isOwner && (
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
            <Settings size={16} /> Settings
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{project.description || 'No description provided.'}</p>
            
            {(project.github_url || project.live_url || (project.tech_stack && project.tech_stack.length > 0)) && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="font-bold text-white mb-4">Technical Details</h3>
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-xs text-electric-cyan font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-4">
                  {project.github_url && (
                    <Link href={project.github_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                      <Github size={16} /> Repository
                    </Link>
                  )}
                  {project.live_url && (
                    <Link href={project.live_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                      <Globe size={16} /> Live Demo
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-electric-cyan" /> Team ({approvedMembers.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {approvedMembers.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {member.profiles?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        {member.profiles?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.profiles?.full_name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isOwner && pendingRequests.length > 0 && (
            <div className="glass p-6 rounded-3xl border border-yellow-500/30 bg-yellow-500/5">
              <h2 className="font-bold text-yellow-400 mb-4">Pending Requests ({pendingRequests.length})</h2>
              <div className="space-y-4">
                {pendingRequests.map((req: any) => (
                  <div key={req.id} className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-sm font-medium text-white">{req.profiles?.full_name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500 mb-3">{req.profiles?.department || 'Unknown Dept'}</p>
                    <ManageRequestButtons memberId={req.id} projectId={params.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
