"use client";

import { useState } from "react";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function ClubApplicationForm({ drives, clubName }: { drives: any[], clubName: string }) {
  const [role, setRole] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast("File is too large. Maximum size is 5MB.", "error");
        return;
      }
      if (selectedFile.type !== "application/pdf") {
        toast("Only PDF files are allowed.", "error");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return toast("Please select a role.", "error");
    
    setIsSubmitting(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You must be logged in to apply.");

      let resumeUrl = null;
      if (file) {
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
        const filePath = `resumes/${user.id}/${uniqueFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Failed to upload resume: " + uploadError.message);
        resumeUrl = filePath;
      }

      const { error: dbError } = await supabase.from('club_recruitment_applications').insert({
        drive_role_id: role,
        student_id: user.id,
        responses: { why_join: whyJoin, experience },
        resume_url: resumeUrl,
        status: 'pending'
      });

      if (dbError) throw new Error("Failed to submit application: " + dbError.message);

      setIsSuccess(true);
      toast("Application submitted successfully!", "success");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Application Received!</h2>
        <p className="text-gray-400">Thank you for applying to {clubName}. We will review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Select a Role</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {drives.flatMap((drive: any) => drive.recruitment_roles || drive.club_recruitment_roles || []).map((r: any) => (
            <label key={r.id} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/40 cursor-pointer hover:border-electric-blue/50 transition-colors has-[:checked]:border-electric-blue has-[:checked]:bg-electric-blue/5">
              <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={(e) => setRole(e.target.value)} className="mt-1 accent-electric-blue" required />
              <div>
                <span className="block font-bold text-white text-sm mb-1">{r.title}</span>
                <span className="block text-xs text-gray-400 line-clamp-2">{r.description || 'Join the team.'}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Questionnaire */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Application Questions</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 block">Why do you want to join {clubName}?</label>
            <textarea required value={whyJoin} onChange={(e) => setWhyJoin(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-electric-blue resize-none"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 block">What relevant skills or experience do you have?</label>
            <textarea required value={experience} onChange={(e) => setExperience(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-electric-blue resize-none"></textarea>
          </div>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Resume / Portfolio (Optional)</h3>
        <div className="w-full border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors bg-black/20 cursor-pointer hover:border-electric-blue/50 relative">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <Upload size={32} className="text-gray-500 mb-4" />
          <span className="text-sm font-bold text-white mb-1">
            {file ? file.name : "Click to upload or drag and drop"}
          </span>
          <span className="text-xs text-gray-500">PDF, max 5MB</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <MagneticButton>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />} 
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </MagneticButton>
      </div>
    </form>
  );
}
