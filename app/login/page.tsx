"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MagneticButton from "@/components/ui/MagneticButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="glass p-8 rounded-2xl w-full max-w-md border-t border-t-white/20">
        <h2 className="text-3xl font-heading font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-sm">Sign in to your ECSA account</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@nmiet.edu.in"
            className="px-4 py-3 bg-navy-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-electric-blue transition-colors"
            required
          />
          <MagneticButton>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-electric-blue text-navy-900 font-semibold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Magic Link"}
            </button>
          </MagneticButton>
          
          {message && (
            <p className="text-center text-sm mt-4 text-electric-cyan">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
