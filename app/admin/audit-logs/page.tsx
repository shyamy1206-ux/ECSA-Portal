import { createClient } from "@/lib/supabase/server";
import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminAuditLogsPage() {
  const supabase = createClient();

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const actionColor = (action: string) => {
    if (action.includes('approve') || action.includes('publish')) return 'text-green-400 bg-green-500/20';
    if (action.includes('reject') || action.includes('delete')) return 'text-red-400 bg-red-500/20';
    if (action.includes('create') || action.includes('insert')) return 'text-electric-blue bg-electric-blue/20';
    if (action.includes('update') || action.includes('edit')) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-gray-400 bg-white/10';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Audit Logs</h1>
        <p className="text-gray-400">Complete history of administrative actions on the platform.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {logs && logs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {logs.map((log: any) => (
              <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold shrink-0">
                  {log.profiles?.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{log.profiles?.full_name || 'System'}</span>
                    {' '}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                    {' '}
                    <span className="text-gray-400">{log.entity_type}</span>
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-gray-600 mt-1 font-mono truncate">
                      {JSON.stringify(log.details).substring(0, 100)}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-600 shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12">
            <EmptyState
              title="No Audit Logs"
              description="Administrative actions will be recorded here automatically."
              icon={<ScrollText size={32} />}
              className="border-none bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
