import { createClient } from "@/lib/supabase/server";
import { HelpCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusUpdater } from "@/components/admin/StatusUpdater";

export default async function AdminHelpdeskPage() {
  const supabase = createClient();

  const { data: requests } = await supabase
    .from('service_requests')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  const statusColor = (status: string) => {
    switch (status) {
      case 'resolved': case 'closed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': case 'assigned': return 'bg-electric-blue/20 text-electric-blue';
      case 'submitted': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Helpdesk</h1>
        <p className="text-gray-400">Manage student service requests and support tickets.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Request</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((req: any) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white line-clamp-1 max-w-xs">{req.subject || req.description?.substring(0, 60)}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{req.profiles?.full_name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{req.category || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusUpdater 
                        id={req.id} 
                        table="service_requests" 
                        currentStatus={req.status} 
                        options={[
                          { label: 'Pending', value: 'pending' },
                          { label: 'In Progress', value: 'in_progress' },
                          { label: 'Resolved', value: 'resolved' },
                          { label: 'Closed', value: 'closed' }
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState title="No Service Requests" description="Student helpdesk requests will appear here." icon={<HelpCircle size={32} />} className="border-none bg-transparent" />
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
