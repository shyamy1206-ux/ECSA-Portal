import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Code, Link as LinkIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export const revalidate = 60;

export default async function ClubDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!club) {
    notFound();
  }

  // Fetch active recruitment drives
  const { data: drives } = await supabase
    .from('club_recruitment_drives')
    .select('*, recruitment_roles(id, title, vacancies)')
    .eq('club_id', club.id)
    .eq('status', 'open');

  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 shrink-0 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl font-heading font-bold text-gray-500 overflow-hidden">
          {club.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            club.name.substring(0, 2).toUpperCase()
          )}
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex justify-center md:justify-start gap-2 mb-3">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300">
              {club.department || 'General'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{club.name}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{club.description || 'No description provided.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Recruitment Section */}
          {drives && drives.length > 0 && (
            <div className="glass p-8 rounded-3xl border border-electric-blue/30 bg-electric-blue/5">
              <h2 className="text-2xl font-bold text-white mb-2">We are Recruiting!</h2>
              <p className="text-gray-400 mb-6">Join {club.name} and help us build the future.</p>
              
              <div className="space-y-4 mb-6">
                {drives.map((drive: any) => (
                  <div key={drive.id} className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <h3 className="font-bold text-white mb-2">{drive.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {drive.recruitment_roles?.map((role: any) => (
                        <span key={role.id} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">
                          {role.title} ({role.vacancies} open)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <MagneticButton>
                <Link href={`/clubs/${club.slug}/apply`} className="inline-flex items-center gap-2 px-6 py-3 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors">
                  Apply Now <ChevronRight size={18} />
                </Link>
              </MagneticButton>
            </div>
          )}

          <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">About the Club</h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>Welcome to the official page of {club.name}.</p>
              <p>More detailed information will be updated here by the club coordinators soon.</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <LinkIcon size={16} /> Official Website
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Code size={16} /> GitHub Org
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
