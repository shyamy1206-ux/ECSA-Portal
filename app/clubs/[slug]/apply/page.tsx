import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import ClubApplicationForm from "./ClubApplicationForm";

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
        <ClubApplicationForm drives={drives} clubName={club.name} />
      </div>
    </div>
  );
}
