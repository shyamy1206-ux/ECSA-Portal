"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Command } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
        aria-haspopup="dialog"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
      >
        <Search size={16} aria-hidden="true" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:flex items-center gap-1 font-sans text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-gray-500" aria-hidden="true">
          <Command size={10} /> K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
      
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Global Search"
        className="relative z-10 w-full max-w-2xl bg-[#0a0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Search Input Area */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/20">
          <Search size={20} className="text-gray-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            aria-label="Search query"
            placeholder="Search clubs, events, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg text-white focus:outline-none placeholder:text-gray-500"
          />
          {loading && <Loader2 size={18} className="text-electric-blue animate-spin shrink-0" aria-label="Loading" />}
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close search"
            className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-electric-blue focus:outline-none"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="Search Results">
          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {query.length < 2 && (
            <div className="p-8 text-center text-gray-600 text-sm flex flex-col items-center gap-2">
              <Command size={24} className="opacity-20 mb-2" />
              Start typing to search across the Campus OS
            </div>
          )}

          {results.length > 0 && (
            <div className="flex flex-col gap-1">
              {results.map((res) => (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(res.url);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-white font-medium group-hover:text-electric-cyan transition-colors">
                      {res.title}
                    </h4>
                    {res.subtitle && <p className="text-xs text-gray-500 truncate mt-0.5">{res.subtitle}</p>}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-black/40 border border-white/5 shrink-0 ml-4 ${
                    res.type === 'Club' ? 'text-electric-violet' :
                    res.type === 'Event' ? 'text-electric-cyan' :
                    res.type === 'Project' ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
