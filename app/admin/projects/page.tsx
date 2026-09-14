import { createClient } from "@/lib/supabase/server";
import { FolderGit2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminProjectsPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Projects</h1>
        <p className="text-gray-400">Review and approve student project submissions for the showcase.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Creator</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map((p: any) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{p.summary}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{p.profiles?.full_name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {p.tech_stack?.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-gray-400">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-gray-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState title="No Projects" description="Student projects will appear here for review." icon={<FolderGit2 size={32} />} className="border-none bg-transparent" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
