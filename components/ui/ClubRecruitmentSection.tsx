import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronRight, Calendar, Users } from "lucide-react";
import MagneticButton from "./MagneticButton";

interface ClubRecruitmentSectionProps {
  clubId: string;
  clubSlug: string;
}

export default async function ClubRecruitmentSection({ clubId, clubSlug }: ClubRecruitmentSectionProps) {
  const supabase = createClient();
  
  // Fetch active recruitment drives
  const { data: drives } = await supabase
    .from('club_recruitment_drives')
    .select('*, roles:club_recruitment_roles(*)')
    .eq('club_id', clubId)
    .eq('status', 'published')
    .gte('close_date', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (!drives || drives.length === 0) {
    return (
      <div className="mt-8 pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm mb-4">Recruitment information will be updated soon.</p>
        <MagneticButton>
          <Link href={`/clubs/${clubSlug}/apply`} className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-colors">
            Register Interest <ChevronRight size={18} />
          </Link>
        </MagneticButton>
      </div>
    );
  }

  const activeDrive = drives[0]; // Display the most recent active drive

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse"></span>
        <h3 className="font-bold text-white text-lg">Active Recruitment Drive</h3>
      </div>
      
      <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-2xl p-6 mb-6">
        <h4 className="font-bold text-white mb-2">{activeDrive.title}</h4>
        <p className="text-gray-300 text-sm mb-4">{activeDrive.description}</p>
        
        <div className="flex flex-wrap gap-4 text-xs font-mono text-electric-cyan mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Closes {format(new Date(activeDrive.close_date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{activeDrive.roles?.length || 0} Positions Available</span>
          </div>
        </div>

        {activeDrive.roles && activeDrive.roles.length > 0 && (
          <div className="space-y-3 mb-6">
            {activeDrive.roles.map((role: any) => (
              <div key={role.id} className="bg-black/40 border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-white text-sm">{role.title}</h5>
                  {role.capacity && (
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">
                      {role.capacity} spots
                    </span>
                  )}
                </div>
                {role.requirements && (
                  <p className="text-xs text-gray-400 leading-relaxed">{role.requirements}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <MagneticButton>
          <Link href={`/clubs/${clubSlug}/apply?drive=${activeDrive.id}`} className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors">
            Apply Now <ChevronRight size={18} />
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}
