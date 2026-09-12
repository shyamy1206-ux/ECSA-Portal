import { createClient } from "@/lib/supabase/server";
import { Search, Filter, MessageSquare, Briefcase, GraduationCap, Users } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export const revalidate = 60;

export default async function MentorshipNetwork() {
  const supabase = createClient();
  
  const { data: mentors } = await supabase
    .from('mentorship_profiles')
    .select('*, profiles(full_name)')
    .eq('is_available', true);

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col h-screen pb-8">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Alumni Mentorship</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Connect with NMIET alumni shaping the tech industry. Filter by company or graduation year to find the perfect mentor.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Glassmorphism Filter Sidebar */}
        <div className="w-80 glass rounded-2xl p-6 flex flex-col border border-white/10 shrink-0">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search alumni..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </div>

          <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Filter size={14} /> Filters
          </h3>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <h4 className="text-sm font-medium mb-3">Company</h4>
              <div className="space-y-2">
                {/* Real implementation would derive this dynamically from the mentors list */}
                {["Google", "AWS", "Vercel", "Microsoft"].map(company => (
                  <label key={company} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-black/40 text-electric-blue focus:ring-electric-blue" />
                    {company}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alumni List / Chat Interface */}
        <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          {mentors && mentors.length > 0 ? (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto h-full custom-scrollbar">
              {mentors.map((alumnus) => (
                <div key={alumnus.id} className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-electric-blue/30 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                        {alumnus.profiles?.full_name?.charAt(0) || '?'}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]"></span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{alumnus.profiles?.full_name}</h4>
                        <p className="text-xs text-gray-400">{alumnus.job_title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Briefcase size={14} className="text-electric-blue" /> {alumnus.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <GraduationCap size={14} className="text-electric-magenta" /> Class of {alumnus.graduation_year}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {alumnus.expertise?.map((skill: string) => (
                        <span key={skill} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400">{skill}</span>
                      ))}
                    </div>
                    <MagneticButton>
                      <button className="p-2 bg-white/5 group-hover:bg-electric-blue group-hover:text-navy-900 rounded-lg transition-colors text-white">
                        <MessageSquare size={16} />
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <Users size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Mentors Available</h3>
              <p className="text-gray-400 max-w-md">Our alumni network is currently being onboarded to the new platform.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
