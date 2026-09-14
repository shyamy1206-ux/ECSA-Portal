"use client";

import { useState } from "react";
import { createProject } from "@/app/app/projects/actions";
import { useToast } from "@/components/ui/Toast";

export function NewProjectForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function actionHandler(formData: FormData) {
    setLoading(true);
    try {
      const res = await createProject(formData);
      if (res?.error) {
        toast(res.error, 'error');
        setLoading(false); // only reset on error, success redirects
      }
    } catch (e) {
      toast("An unexpected error occurred", 'error');
      setLoading(false);
    }
  }

  return (
    <form action={actionHandler} className="space-y-6 glass p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Project Title</label>
        <input 
          type="text" 
          name="title" 
          required 
          placeholder="E.g., Autonomous Drone Navigation" 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Short Summary</label>
        <input 
          type="text" 
          name="summary" 
          required 
          maxLength={150}
          placeholder="A one-sentence pitch of your project..." 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Tech Stack (comma separated)</label>
        <input 
          type="text" 
          name="tech_stack" 
          placeholder="React, Python, OpenCV, Arduino..." 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors font-mono text-sm" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Full Description</label>
        <textarea 
          name="description" 
          rows={5} 
          placeholder="Describe the problem, solution, and current progress..." 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">GitHub Repository URL</label>
          <input 
            type="url" 
            name="github_url" 
            placeholder="https://github.com/..." 
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors font-mono text-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Live Demo URL</label>
          <input 
            type="url" 
            name="live_url" 
            placeholder="https://..." 
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors font-mono text-sm" 
          />
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}
