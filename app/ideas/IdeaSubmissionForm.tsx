"use client";

import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function IdeaSubmissionForm({ submitIdea }: { submitIdea: (formData: FormData) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await submitIdea(formData);
    setSuccess(true);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Your Idea</label>
        <textarea 
          name="content"
          required
          rows={4}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-electric-blue text-white resize-none"
          placeholder="I think we should organize a hardware hackathon..."
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          name="is_anonymous" 
          id="is_anonymous" 
          defaultChecked
          className="rounded border-white/20 bg-black/40 text-electric-blue focus:ring-electric-blue"
        />
        <label htmlFor="is_anonymous" className="text-sm text-gray-400 cursor-pointer">
          Submit Anonymously
        </label>
      </div>

      <MagneticButton>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 px-6 py-3 bg-electric-blue text-navy-900 font-medium rounded-xl hover:bg-electric-cyan transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit to ECSA Board'}
        </button>
      </MagneticButton>

      {success && (
        <p className="text-electric-cyan text-sm text-center mt-2 animate-pulse">
          Idea submitted successfully!
        </p>
      )}
    </form>
  );
}
