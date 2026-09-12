"use client";

import { useState } from "react";
import { ShieldCheck, Search, XCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CertificateVerification() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    setStatus('loading');
    
    // Simulate Supabase fetch
    setTimeout(() => {
      setStatus('error'); // By default, since we don't have real certs generated yet
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 px-8 flex flex-col items-center justify-center relative pb-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-cyan/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-xl w-full text-center mb-10">
        <ShieldCheck size={48} className="text-electric-cyan mx-auto mb-6" />
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Certificate Verification</h1>
        <p className="text-gray-400">
          Enter the unique Certificate ID found at the bottom of your ECSA or NMIET certificate to verify its authenticity.
        </p>
      </div>

      <div className="w-full max-w-md glass p-2 rounded-2xl border border-white/10 relative">
        <form onSubmit={handleVerify} className="flex">
          <input 
            type="text" 
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="e.g. ECSA-2026-ABCD"
            className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none uppercase font-mono tracking-wider"
          />
          <MagneticButton>
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="px-6 py-3 bg-white text-navy-900 rounded-xl font-bold flex items-center gap-2 hover:bg-electric-cyan transition-colors"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={18} /> Verify
                </>
              )}
            </button>
          </MagneticButton>
        </form>
      </div>

      {status === 'error' && (
        <div className="mt-8 glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-start gap-4 max-w-md w-full animate-fade-in">
          <XCircle className="text-red-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-red-400 font-bold mb-1">Certificate Not Found</h3>
            <p className="text-sm text-gray-400">We couldn&apos;t find a certificate matching that ID in our secure database. Please check the ID and try again.</p>
          </div>
        </div>
      )}
    </div>
  );
}
