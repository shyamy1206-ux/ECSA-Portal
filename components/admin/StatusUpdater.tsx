"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

export function StatusUpdater({ id, table, currentStatus, options }: { id: string, table: string, currentStatus: string, options: { label: string, value: string }[] }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast("Status updated", "success");
      router.refresh();
    } catch (e: any) {
      toast("Error: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={currentStatus || ''}
        onChange={(e) => handleUpdate(e.target.value)}
        disabled={loading}
        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-electric-blue disabled:opacity-50"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {loading && <Loader2 size={12} className="animate-spin text-electric-cyan" />}
    </div>
  );
}
