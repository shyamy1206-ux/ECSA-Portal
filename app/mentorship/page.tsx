"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const ALUMNI = [
  { id: 1, name: "Sneha Patil", role: "Software Engineer II", company: "Google", year: "2021", skills: ["React", "System Design"], status: "online" },
  { id: 2, name: "Rohan Joshi", role: "Cloud Architect", company: "AWS", year: "2019", skills: ["AWS", "DevOps"], status: "offline" },
  { id: 3, name: "Aarav Desai", role: "Frontend Developer", company: "Vercel", year: "2023", skills: ["Next.js", "Framer Motion"], status: "online" },
];

export default function MentorshipNetwork() {
  const [activeChat, setActiveChat] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col h-screen">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Alumni Mentorship</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Connect with NMIET alumni shaping the tech industry. Filter by company or graduation year to find the perfect mentor.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 pb-8">
        {/* Glassmorphism Filter Sidebar */}
        <div className="w-80 glass rounded-2xl p-6 flex flex-col border border-white/10 shrink-0">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search alumni..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </div>

          <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Filter size={14} /> Filters
          </h3>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <h4 className="text-sm font-medium mb-3">Company</h4>
              <div className="space-y-2">
                {["Google", "AWS", "Vercel", "Microsoft"].map(company => (
                  <label key={company} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-black/40 text-electric-blue focus:ring-electric-blue" />
                    {company}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Graduation Year</h4>
              <div className="space-y-2">
                {["2023", "2022", "2021", "2020", "2019"].map(year => (
                  <label key={year} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-black/40 text-electric-blue focus:ring-electric-blue" />
                    {year}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alumni List / Chat Interface */}
        <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          {activeChat ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white">
                  ← Back
                </button>
                <div>
                  <h3 className="font-semibold text-white">{ALUMNI.find(a => a.id === activeChat)?.name}</h3>
                  <p className="text-xs text-electric-cyan">{ALUMNI.find(a => a.id === activeChat)?.company}</p>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-end space-y-4">
                <div className="text-center text-xs text-gray-500 mb-4">Start of conversation</div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-sm max-w-[80%] self-start">
                  <p className="text-sm">Hi! I saw you're interested in System Design. Happy to chat.</p>
                </div>
              </div>
              <div className="p-4 bg-black/40 border-t border-white/10">
                <div className="flex gap-2">
                  <input type="text" placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-electric-blue" />
                  <button className="px-4 py-2 bg-electric-blue text-navy-900 rounded-lg font-semibold hover:bg-electric-cyan transition-colors">Send</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto h-full custom-scrollbar">
              {ALUMNI.map((alumnus) => (
                <div key={alumnus.id} className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-electric-blue/30 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                        {alumnus.name.charAt(0)}
                        {alumnus.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]"></span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{alumnus.name}</h4>
                        <p className="text-xs text-gray-400">{alumnus.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Briefcase size={14} className="text-electric-blue" /> {alumnus.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <GraduationCap size={14} className="text-electric-magenta" /> Class of {alumnus.year}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex gap-1">
                      {alumnus.skills.map(skill => (
                        <span key={skill} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400">{skill}</span>
                      ))}
                    </div>
                    <MagneticButton>
                      <button 
                        onClick={() => setActiveChat(alumnus.id)}
                        className="p-2 bg-white/5 group-hover:bg-electric-blue group-hover:text-navy-900 rounded-lg transition-colors text-white"
                      >
                        <MessageSquare size={16} />
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
