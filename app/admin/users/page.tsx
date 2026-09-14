import { createClient } from "@/lib/supabase/server";
import { Shield, UserCheck, UserX } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, department, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: roles } = await supabase
    .from('user_roles')
    .select('user_id, role');

  // Build a role lookup
  const roleMap: Record<string, string[]> = {};
  (roles || []).forEach((r: any) => {
    if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
    roleMap[r.user_id].push(r.role);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Users & Roles</h1>
        <p className="text-gray-400">Manage platform users and their access levels.</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Roles</th>
                <th className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles && profiles.length > 0 ? (
                profiles.map((user: any) => {
                  const userRoles = roleMap[user.id] || [];
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{user.full_name || 'Unnamed'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{user.department || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {userRoles.length > 0 ? userRoles.map((role: string) => (
                            <span key={role} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              role === 'super_admin' ? 'bg-red-500/20 text-red-400' :
                              role === 'ecsa_admin' ? 'bg-electric-violet/20 text-electric-violet' :
                              role === 'club_coordinator' ? 'bg-electric-cyan/20 text-electric-cyan' :
                              'bg-white/10 text-gray-400'
                            }`}>
                              {role.replace(/_/g, ' ')}
                            </span>
                          )) : (
                            <span className="text-xs text-gray-600">Student</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
