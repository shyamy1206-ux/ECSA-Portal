import { createClient } from "@/lib/supabase/server";
import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewAnnouncementButton } from "@/components/admin/NewAnnouncementButton";

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Announcements</h1>
          <p className="text-gray-400">Manage campus-wide announcements and ticker content.</p>
        </div>
        <NewAnnouncementButton />
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {announcements && announcements.length > 0 ? (
                announcements.map((a: any) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{a.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{a.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        a.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        a.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-gray-400'
                      }`}>{a.priority || 'normal'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        a.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        a.status === 'draft' ? 'bg-white/10 text-gray-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12">
                    <EmptyState
                      title="No Announcements"
                      description="Create your first campus announcement to appear in the homepage ticker."
                      icon={<Megaphone size={32} />}
                      className="border-none bg-transparent"
                    />
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
