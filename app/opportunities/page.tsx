import { createClient } from "@/lib/supabase/server";
import { Briefcase, MapPin, Globe, Clock, ChevronRight } from "lucide-react";

export const revalidate = 60;

export default async function OpportunitiesPage() {
  const supabase = createClient();
  
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Opportunities</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Internships, full-time roles, freelance gigs, and hackathons curated for NMIET students.
        </p>
      </div>

      <div className="space-y-4">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <a key={opp.id} href={opp.link} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="glass p-6 rounded-2xl border border-white/10 hover:border-electric-blue/50 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-electric-blue transition-colors">{opp.title}</h3>
                    <span className="px-2 py-0.5 text-xs rounded bg-white/10 text-gray-300 uppercase tracking-wider font-medium">
                      {opp.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {opp.company}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(opp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end text-electric-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <span className="text-sm font-bold mr-2">Apply Now</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="glass p-16 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center">
             <Briefcase size={48} className="text-gray-600 mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">No Open Opportunities</h3>
             <p className="text-gray-400 max-w-md">Our alumni and partners are currently preparing new postings. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
