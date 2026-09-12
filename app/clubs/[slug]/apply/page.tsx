import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default async function ClubApplicationPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!club) {
    notFound();
  }

  // Fetch open drives
  const { data: drives } = await supabase
    .from('club_recruitment_drives')
    .select('*, recruitment_roles(*)')
    .eq('club_id', club.id)
    .eq('status', 'open');

  if (!drives || drives.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Recruitment Closed</h1>
        <p className="text-gray-400 mb-8">{club.name} is not currently accepting applications.</p>
        <Link href={`/clubs/${club.slug}`} className="text-electric-blue hover:underline">Return to Club Page</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-8 max-w-3xl mx-auto pb-20">
      <Link href={`/clubs/${club.slug}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to {club.name}
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Join {club.name}</h1>
        <p className="text-gray-400">Complete the application below to be considered for open roles.</p>
      </div>

      <div className="glass p-8 md:p-10 rounded-3xl border border-white/10">
        <form className="space-y-8">
          
          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Select a Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drives.flatMap((drive: any) => drive.recruitment_roles).map((role: any) => (
                <label key={role.id} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/40 cursor-pointer hover:border-electric-blue/50 transition-colors has-[:checked]:border-electric-blue has-[:checked]:bg-electric-blue/5">
                  <input type="radio" name="role" value={role.id} className="mt-1 accent-electric-blue" required />
                  <div>
                    <span className="block font-bold text-white text-sm mb-1">{role.title}</span>
                    <span className="block text-xs text-gray-400 line-clamp-2">{role.description || 'Join the team.'}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Questionnaire */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Application Questions</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 block">Why do you want to join {club.name}?</label>
                <textarea required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-electric-blue resize-none"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 block">What relevant skills or experience do you have?</label>
                <textarea required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-electric-blue resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Resume / Portfolio (Optional)</h3>
            <div className="w-full border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-electric-blue/50 transition-colors bg-black/20 cursor-pointer">
              <Upload size={32} className="text-gray-500 mb-4" />
              <span className="text-sm font-bold text-white mb-1">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-500">PDF, max 5MB</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <MagneticButton>
              <button type="button" className="w-full py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Submit Application
              </button>
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
}
