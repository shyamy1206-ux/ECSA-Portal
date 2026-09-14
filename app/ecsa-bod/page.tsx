import MagneticButton from "@/components/ui/MagneticButton";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

interface BODMember {
  id?: string;
  full_name: string;
  post: string;
  session: string;
  responsibility?: string;
  photo_path?: string;
  display_order: number;
  is_active?: boolean;
  highlight?: boolean;
}

// Fallback data in case database fetch fails (e.g., no DB connected)
const FALLBACK_BOD_MEMBERS: BODMember[] = [
  { post: "PRESIDENT", full_name: "Priyanshu Prasad", session: "EST 2026-27", responsibility: "Leads the association", display_order: 1 },
  { post: "VICE PRESIDENT", full_name: "Tanushree Jadhav", session: "EST 2026-27", responsibility: "Assists the President", display_order: 2 },
  { post: "SECRETARY", full_name: "Ojas Sulakhe", session: "EST 2026-27", responsibility: "Manages administration", display_order: 3 },
  { post: "JOINT SECRETARY", full_name: "Vrushabh Yeole", session: "EST 2026-27", responsibility: "Assists the Secretary", display_order: 4, highlight: true },
  { post: "TREASURER", full_name: "Aman Wagh", session: "EST 2026-27", responsibility: "Financial management", display_order: 5 },
  { post: "PR & OUTREACH HEAD", full_name: "Tanaya Patil", session: "EST 2026-27", responsibility: "Public relations", display_order: 6 },
  { post: "TECHNICAL HEAD", full_name: "Shrujal Inde", session: "EST 2026-27", responsibility: "Technical operations", display_order: 7 },
  { post: "EVENT MANAGEMENT HEAD", full_name: "Vaibhav", session: "EST 2026-27", responsibility: "Event coordination", display_order: 8 },
  { post: "SOCIAL MEDIA & PUBLICITY HEAD", full_name: "Pranav Borkar", session: "EST 2026-27", responsibility: "Social media", display_order: 9 },
  { post: "DESIGN & CREATIVE HEAD", full_name: "Payal Jadhav", session: "EST 2026-27", responsibility: "Design", display_order: 10 },
  { post: "SPONSORSHIP & INDUSTRY HEAD", full_name: "Atharva Karanjekar", session: "EST 2026-27", responsibility: "Sponsorships", display_order: 11 },
  { post: "DISCIPLINE & COORDINATION HEAD", full_name: "Dipali Thorbole", session: "EST 2026-27", responsibility: "Discipline", display_order: 12 }
];

export default async function BoardOfDirectorsPage() {
  const supabase = createClient();
  
  let members: BODMember[] = [];
  try {
    const { data, error } = await supabase
      .from('bod_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
      
    if (!error && data) {
      members = data as BODMember[];
    }
  } catch (err) {
    // Graceful fallback if no DB connection
  }

  // Use fallback if no members found
  if (!members || members.length === 0) {
    members = FALLBACK_BOD_MEMBERS;
  }

  // Helper to get public URL for images
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    const { data } = supabase.storage.from('bod-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col">
      <div className="mb-12 relative z-10 pointer-events-none text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Board of Directors</h1>
        <p className="text-gray-400 text-lg">
          Meet the dedicated team leading the Electronics & Computer Students Association.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 relative z-10 pb-20">
        {members.map((member: BODMember) => {
          const photoUrl = getImageUrl(member.photo_path);
          const isHighlight = member.highlight || member.post?.includes('PRESIDENT') || member.post?.includes('SECRETARY');

          return (
            <article
              key={member.id || member.post}
              className={`flex w-full min-h-[300px] flex-col sm:flex-row items-stretch justify-between rounded-2xl border transition-transform hover:-translate-y-1 overflow-hidden ${
                isHighlight 
                  ? 'border-electric-blue/50 bg-electric-blue/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <p className={`text-xs tracking-widest font-bold uppercase mb-2 ${isHighlight ? 'text-electric-cyan' : 'text-electric-blue'}`}>
                  {member.post}
                </p>
                <h3 className="text-2xl font-semibold text-white mb-1">
                  {member.full_name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  ECSA Board &middot; {member.session || 'EST 2026-27'}
                </p>
                {member.responsibility && (
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {member.responsibility}
                  </p>
                )}
                <div>
                  <button className="text-sm text-white/70 hover:text-white flex items-center gap-1 transition-colors group">
                    <span className="border-b border-white/30 group-hover:border-white transition-colors">View profile</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Photo Area */}
              <div className="w-full sm:w-[40%] h-80 sm:h-auto relative bg-[#0a1020] border-l border-white/10 overflow-hidden group">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${member.full_name} - ${member.post}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,rgba(0,210,255,0.1),transparent)]" />
                    <span className="text-5xl font-heading font-bold text-gray-700">
                      {member.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Subtle blue inner border overlay */}
                <div className="absolute inset-0 border border-electric-blue/20 pointer-events-none" />
              </div>
            </article>
          );
        })}
      </div>
      
      <div className="flex justify-center pb-12 relative z-10">
        <MagneticButton>
          <a href="/contact" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors inline-block border border-white/10">
            Contact the Board
          </a>
        </MagneticButton>
      </div>
    </div>
  );
}
