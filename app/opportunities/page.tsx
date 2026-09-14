import { createStaticClient } from "@/lib/supabase/static";
import { Briefcase, Calendar, ChevronRight, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 60;

export default async function OpportunitiesPage() {
  const supabase = createStaticClient();
  
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
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
          opportunities.map((opp: any) => {
            const hasExternalUrl = !!opp.external_url;
            const cardContent = (
              <div className="glass p-6 rounded-2xl border border-white/10 hover:border-electric-blue/50 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-bold text-xl text-white group-hover:text-electric-blue transition-colors">{opp.title}</h3>
                    <span className="px-3 py-1 text-xs rounded-full bg-electric-violet/20 text-electric-violet uppercase tracking-wider font-bold">
                      {opp.category || 'Opportunity'}
                    </span>
                  </div>
                  
                  {opp.description && (
                    <p className="text-sm text-gray-300 mb-4 max-w-3xl line-clamp-2">
                      {opp.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    {opp.eligibility && (
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                        <Briefcase size={14} className="text-gray-500" /> {opp.eligibility}
                      </span>
                    )}
                    {opp.deadline && (
                      <span className="flex items-center gap-1 text-electric-cyan/80">
                        <Calendar size={14} /> Deadline: {format(new Date(opp.deadline), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                
                {hasExternalUrl && (
                  <div className="flex items-center justify-between md:justify-end text-electric-cyan md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all mt-4 md:mt-0">
                    <span className="text-sm font-bold mr-2">Apply Externally</span>
                    <ExternalLink size={18} />
                  </div>
                )}
              </div>
            );

            return hasExternalUrl ? (
              <a key={opp.id} href={opp.external_url} target="_blank" rel="noopener noreferrer" className="block group">
                {cardContent}
              </a>
            ) : (
              <div key={opp.id} className="block group cursor-default">
                {cardContent}
              </div>
            );
          })
        ) : (
          <EmptyState 
            title="No Open Opportunities"
            description="Our alumni and partners are currently preparing new postings. Check back soon for internships, jobs, and hackathons!"
            icon={<Briefcase size={48} />}
          />
        )}
      </div>
    </div>
  );
}
