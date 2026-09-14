import { createClient } from "@/lib/supabase/server";
import { Briefcase, Calendar, Check, X, Plus, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminOpportunitiesPage() {
  const supabase = createClient();
  
  // Fetch all opportunities (admin can see pending, approved, etc.)
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Opportunities Board</h2>
          <p className="text-gray-400 text-sm">Review, approve, and manage campus jobs and internships.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-medium rounded-lg hover:bg-electric-cyan transition-colors">
          <Plus size={18} /> New Opportunity
        </button>
      </div>

      <div className="space-y-4">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp: any) => (
            <div key={opp.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-white">{opp.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded uppercase tracking-wider font-bold ${
                    opp.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                    opp.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {opp.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-medium">{opp.category}</span>
                  {opp.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {format(new Date(opp.deadline), "MMM d, yyyy")}
                    </span>
                  )}
                  {opp.external_url && (
                    <Link href={opp.external_url} target="_blank" className="flex items-center gap-1 text-electric-cyan hover:underline">
                      <ExternalLink size={12} /> External Link
                    </Link>
                  )}
                </div>
                {opp.profiles && (
                  <p className="text-xs text-gray-500">Submitted by {opp.profiles.full_name}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors" title="Approve">
                  <Check size={18} />
                </button>
                <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState 
            title="No Opportunities Found"
            description="There are currently no opportunities submitted to the board."
            icon={<Briefcase size={32} />}
          />
        )}
      </div>
    </div>
  );
}
