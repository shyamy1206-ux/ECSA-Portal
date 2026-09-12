import { createClient } from "@/lib/supabase/server";
import { Plus, Users, UserCheck, XCircle } from "lucide-react";


export default async function AdminRecruitment() {
  const supabase = createClient();
  
  const { data: drives } = await supabase
    .from('club_recruitment_drives')
    .select('*, clubs(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Recruitment Drives</h2>
          <p className="text-gray-400 text-sm">Manage open roles and review student applications.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-medium rounded-lg hover:bg-electric-cyan transition-colors">
          <Plus size={18} /> New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drives && drives.length > 0 ? (
          drives.map((drive) => (
            <div key={drive.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-white">{drive.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded uppercase font-bold ${
                    drive.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    drive.status === 'closed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                    {drive.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Club: {drive.clubs?.name}</p>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 mb-1"><Users size={16} /></span>
                  <span className="font-mono text-white">0 Total</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-green-500 mb-1"><UserCheck size={16} /></span>
                  <span className="font-mono text-white">0 Approved</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-red-500 mb-1"><XCircle size={16} /></span>
                  <span className="font-mono text-white">0 Rejected</span>
                </div>
                <button className="ml-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors border border-white/10">
                  Review
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass p-12 rounded-2xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center">
             <Users size={40} className="text-gray-600 mb-4" />
             <h3 className="text-lg font-bold text-white mb-2">No Recruitment Drives</h3>
             <p className="text-sm text-gray-400 max-w-sm">Create a recruitment drive to start accepting student applications for club roles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
