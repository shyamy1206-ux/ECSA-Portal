"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder, FileText, Download, Check } from "lucide-react";

// Mock data
const resources = [
  { id: 1, name: "OS_Notes_Unit1.pdf", type: "file", category: "Study Material", size: "2.4 MB" },
  { id: 2, name: "React_Workshop_Slides", type: "folder", category: "Workshop", items: 4 },
  { id: 3, name: "Previous_Year_Question_Papers", type: "folder", category: "Academics", items: 12 },
  { id: 4, name: "System_Design_Interview_Prep.pdf", type: "file", category: "Interview Prep", size: "5.1 MB" },
];

export default function ResourceVault() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col h-screen">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Resource Vault</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Centralized repository for verified study materials, workshop slides, and coding tutorials.
        </p>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden mb-8">
        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Root</span>
            <span>/</span>
            <span className="text-electric-cyan">All Resources</span>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Size / Items</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 flex items-center gap-3">
                    {res.type === 'folder' ? (
                      // 3D styled folder icon representation
                      <div className="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                         <Folder className="text-electric-blue absolute" fill="currentColor" size={24} />
                         <Folder className="text-white opacity-20 absolute translate-y-0.5" size={24} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                        <FileText size={20} />
                      </div>
                    )}
                    <span className="font-medium text-white text-sm">{res.name}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400">
                    {res.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                    {res.type === 'folder' ? `${res.items} items` : res.size}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {res.type === 'file' && <DownloadButton />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DownloadButton() {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done'>('idle');

  const handleDownload = () => {
    if (status !== 'idle') return;
    setStatus('downloading');
    
    // Simulate download
    setTimeout(() => {
      setStatus('done');
      
      // Reset after a while
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
            className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]"
          >
            <Check size={18} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
