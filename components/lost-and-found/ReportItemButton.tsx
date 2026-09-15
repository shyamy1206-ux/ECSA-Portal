"use client";

import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { ReportItemModal } from "./ReportItemModal";

export function ReportItemButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MagneticButton>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-electric-blue text-navy-900 font-bold rounded-full hover:bg-electric-cyan transition-colors whitespace-nowrap"
        >
          Report an Item
        </button>
      </MagneticButton>
      
      {isOpen && <ReportItemModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
