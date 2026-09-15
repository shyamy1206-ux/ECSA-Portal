"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check } from "lucide-react";

export default function DownloadButton({ url }: { url?: string }) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done'>('idle');

  const handleDownload = () => {
    if (status !== 'idle') return;
    setStatus('downloading');
    
    // Simulate download for now, in real life you'd trigger a file download from Supabase Storage
    setTimeout(() => {
      setStatus('done');
      if (url) {
          window.open(url, '_blank');
      }
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <button 
      onClick={handleDownload}
      className="relative overflow-hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group hover:border-electric-blue transition-colors focus:outline-none"
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-gray-400 group-hover:text-electric-blue"
          >
            <Download size={16} />
          </motion.div>
        )}
        
        {status === 'downloading' && (
          <motion.div
            key="downloading"
            className="absolute inset-0 bg-electric-blue/20"
            initial={{ height: "0%", top: "100%" }}
            animate={{ height: "100%", top: "0%" }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        )}
        
        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-green-400 drop-"
          >
            <Check size={18} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
