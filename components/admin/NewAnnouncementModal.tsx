"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export function NewAnnouncementModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const priority = formData.get('priority') as string;
      const status = formData.get('status') as string;

      const { error } = await supabase.from('announcements').insert({
        title,
        content,
        priority,
        status,
        author_id: user.id
      });

      if (error) throw error;

      toast("Announcement created successfully!", "success");
      router.refresh();
      onClose();
    } catch (err: any) {
      toast("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-navy-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">New Announcement</h3>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input type="text" name="title" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue" placeholder="e.g. End of Semester Exams" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Content</label>
            <textarea name="content" required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue resize-none" placeholder="Provide details..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Priority</label>
              <select name="priority" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Status</label>
              <select name="status" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
