import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { format } from "date-fns";

export default async function AdminEventsPage() {
  const supabase = createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name)')
    .order('date', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Events</h1>
        <p className="text-gray-400">Manage campus events, registrations, and attendance.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Club</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {events && events.length > 0 ? (
                events.map((e: any) => (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{e.title}</p>
                      <p className="text-xs text-gray-500">{e.type}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{e.clubs?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{format(new Date(e.date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-gray-400">{e.registered_count ?? 0}/{e.capacity ?? '∞'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        e.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        e.status === 'draft' ? 'bg-white/10 text-gray-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState title="No Events" description="Campus events will appear here." icon={<Calendar size={32} />} className="border-none bg-transparent" />
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
