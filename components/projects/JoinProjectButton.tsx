"use client";

import { useState } from "react";
import { requestToJoinProject } from "@/app/app/projects/actions";
import { useToast } from "@/components/ui/Toast";
import { UserPlus } from "lucide-react";

export function JoinProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await requestToJoinProject(projectId, 'member');
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast("Join request sent successfully!", 'success');
      }
    } catch (e) {
      toast("An error occurred.", 'error');
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleJoin}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 text-sm font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
    >
      <UserPlus size={16} />
      {loading ? "Sending..." : "Request to Join"}
    </button>
  );
}
