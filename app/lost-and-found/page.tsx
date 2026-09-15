import { HelpCircle } from "lucide-react";
import { ReportItemButton } from "@/components/lost-and-found/ReportItemButton";
import Link from "next/link";

export default function LostAndFoundPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Lost & Found</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Report lost items or help return found items to their rightful owners on campus.
          </p>
        </div>
        <ReportItemButton />
      </div>

      <div className="glass p-16 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center">
         <HelpCircle size={48} className="text-gray-600 mb-4" />
         <h3 className="text-xl font-bold text-white mb-2">No Active Reports</h3>
         <p className="text-gray-400 max-w-md">The campus lost and found is currently clear.</p>
      </div>
    </div>
  );
}
