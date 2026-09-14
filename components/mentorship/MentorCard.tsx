"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { MentorRequestModal } from "@/components/mentorship/MentorRequestModal";

interface MentorCardProps {
  mentor: any;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-electric-blue/30 transition-colors group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative text-white font-bold">
              {mentor.profiles?.full_name?.charAt(0) || '?'}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]"></span>
            </div>
            <div>
              <h4 className="font-medium text-white">{mentor.profiles?.full_name}</h4>
              <p className="text-xs text-gray-400">{mentor.job_title}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {mentor.company && (
            <p className="text-sm text-gray-300">🏢 {mentor.company}</p>
          )}
          {mentor.graduation_year && (
            <p className="text-sm text-gray-300">🎓 Class of {mentor.graduation_year}</p>
          )}
        </div>

        {mentor.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">{mentor.bio}</p>
        )}

        <div className="flex justify-between items-end">
          <div className="flex gap-1 flex-wrap max-w-[200px]">
            {mentor.expertise?.slice(0, 4).map((skill: string) => (
              <span key={skill} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400">{skill}</span>
            ))}
          </div>
          <MagneticButton>
            <button
              onClick={() => setShowModal(true)}
              className="p-2 bg-white/5 group-hover:bg-electric-blue group-hover:text-navy-900 rounded-lg transition-colors text-white"
            >
              <MessageSquare size={16} />
            </button>
          </MagneticButton>
        </div>
      </div>

      {showModal && (
        <MentorRequestModal
          mentorId={mentor.id}
          mentorName={mentor.profiles?.full_name || 'Mentor'}
          topics={mentor.mentorship_topics || []}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
