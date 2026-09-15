import { createClient } from "@/lib/supabase/server";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusUpdater } from "@/components/admin/StatusUpdater";

export default async function AdminLostFoundPage() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from('lost_found_items')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Lost & Found</h1>
        <p className="text-gray-400">Moderate lost and found reports submitted by students.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Posted By</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map((item: any) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.title || item.description?.substring(0, 40)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.item_type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>{item.item_type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.profiles?.full_name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{item.location || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusUpdater 
                        id={item.id} 
                        table="lost_found_items" 
                        currentStatus={item.status} 
                        options={[
                          { label: 'Pending', value: 'pending' },
                          { label: 'Active', value: 'active' },
                          { label: 'Claimed', value: 'claimed' },
                          { label: 'Returned', value: 'returned' },
                          { label: 'Closed', value: 'closed' }
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState title="No Lost & Found Items" description="Lost and found reports will appear here." icon={<Package size={32} />} className="border-none bg-transparent" />
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
