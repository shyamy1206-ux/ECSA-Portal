"use client";

import { useState } from "react";
import { ShieldCheck, Search, XCircle, CheckCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { createClient } from "@/lib/supabase/client";

export default function CertificateVerification() {
  const supabase = createClient();
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
  const [certData, setCertData] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    setStatus('loading');
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, events(title), profiles(full_name)')
        .eq('verification_hash', certId.trim())
        .maybeSingle();

      if (error || !data) {
        setStatus('error');
        setCertData(null);
      } else {
        setStatus('found');
        setCertData(data);
      }
    } catch (err) {
      setStatus('error');
    }
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

      {status === 'found' && certData && (
        <div className="mt-8 glass p-8 rounded-2xl border border-green-500/30 bg-green-500/5 flex flex-col items-center gap-4 max-w-md w-full animate-fade-in text-center">
          <CheckCircle className="text-green-400" size={48} />
          <div>
            <h3 className="text-green-400 font-bold text-xl mb-4">Verified Authentic</h3>
            <div className="space-y-3 text-left bg-black/40 p-6 rounded-xl border border-white/5">
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider">Recipient</span>
                <span className="font-bold text-white text-lg">{certData.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider">Event / Achievement</span>
                <span className="text-gray-300">{certData.events?.title || certData.type}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider">Issue Date</span>
                <span className="text-gray-300">{new Date(certData.issue_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
