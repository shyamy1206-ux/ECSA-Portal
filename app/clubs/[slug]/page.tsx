import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Code, Link as LinkIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import ClubRecruitmentSection from "@/components/ui/ClubRecruitmentSection";
import { ViewTracker } from "@/components/ui/ViewTracker";

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

  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <ViewTracker contentType="club" contentId={club.id} />
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
          
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">About the Club</h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>Welcome to the official page of {club.name}.</p>
              <p>More detailed information will be updated here by the club coordinators soon.</p>
            </div>
            
            <ClubRecruitmentSection clubId={club.id} clubSlug={club.slug} />
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
