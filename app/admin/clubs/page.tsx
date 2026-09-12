import { createClient } from "@/lib/supabase/server";

// We'll use a clean, borderless table design as requested.
export default async function ClubOnboardingPage() {
  const supabase = createClient();
  
  // Fetch pending clubs
  const { data: pendingClubs } = await supabase
    .from('clubs')
    .select('*, profiles(full_name)')
    .eq('status', 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Club Onboarding</h1>
          <p className="text-gray-400">Review and approve new departmental club registrations.</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
                <th className="px-6 py-4 font-medium">Club Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Requested By</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pendingClubs && pendingClubs.length > 0 ? (
                pendingClubs.map((club) => (
                  <tr key={club.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{club.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{club.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                        {club.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {club.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(club.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Action buttons appear on hover for clean UI */}
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 text-xs font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>No pending club registrations.</p>
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
