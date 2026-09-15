"use client";

import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useToast } from "@/components/ui/Toast";
import { Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      return toast("Please fill in all fields", "error");
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        subject,
        message,
        status: 'new'
      });

      if (error) throw new Error(error.message);

      setIsSuccess(true);
    } catch (err: any) {
      toast("Failed to send message: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
        <p className="text-gray-400">Thank you for reaching out. We will get back to you shortly at {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Your Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors disabled:opacity-50" 
            placeholder="John Doe" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors disabled:opacity-50" 
            placeholder="john@example.com" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Subject</label>
        <input 
          type="text" 
          required
          value={subject}
          onChange={e => setSubject(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors disabled:opacity-50" 
          placeholder="How can we help?" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Message</label>
        <textarea 
          required
          rows={4} 
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none disabled:opacity-50" 
          placeholder="Your message here..."
        ></textarea>
      </div>
      <MagneticButton>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-electric-blue transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </MagneticButton>
    </form>
  );
}
