"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { NewAnnouncementModal } from "./NewAnnouncementModal";

export function NewAnnouncementButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MagneticButton>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg flex items-center gap-2 hover:bg-electric-cyan transition-colors"
        >
          <Plus size={18} /> New Announcement
        </button>
      </MagneticButton>
      
      {isOpen && <NewAnnouncementModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
