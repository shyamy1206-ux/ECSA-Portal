"use client";

import { useState } from "react";
import { updateMemberStatus } from "@/app/app/projects/actions";
import { useToast } from "@/components/ui/Toast";

export function ManageRequestButtons({ memberId, projectId }: { memberId: string, projectId: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleAction(status: 'approved' | 'rejected') {
    setLoading(true);
    try {
      const res = await updateMemberStatus(memberId, status);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast(`Request ${status}`, 'success');
      }
    } catch (e) {
      toast("An error occurred.", 'error');
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleAction('approved')}
        disabled={loading}
        className="flex-1 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
      >
        Accept
      </button>
      <button 
        onClick={() => handleAction('rejected')}
        disabled={loading}
        className="flex-1 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
