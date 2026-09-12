"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

// In a production environment, this would fetch from a 'hackathon_teams' or 'recruitment' table via Supabase
const initialColumns = {
  "available": [],
  "shortlisted": [],
  "team": []
};

export default function HackathonKanban() {
  const [columns, setColumns] = useState(initialColumns);

  // Simplified kanban move logic for demo purposes
  const moveStudent = (studentId: string, fromCol: string, toCol: string) => {
    setColumns(prev => {
      const fromList = [...prev[fromCol as keyof typeof prev]];
      const toList = [...prev[toCol as keyof typeof prev]];
      
      const studentIndex = fromList.findIndex(s => s.id === studentId);
      if (studentIndex === -1) return prev;
      
      const [student] = fromList.splice(studentIndex, 1);
      toList.push(student);
      
      return {
        ...prev,
        [fromCol]: fromList,
        [toCol]: toList
      };
    });
  };

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Team Formation Hub</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Smart India Hackathon 2026 is approaching. Recruit peers based on specific skill tags and move them into your active team roster.
        </p>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Available */}
          <KanbanColumn 
            title="Available Peers" 
            count={columns.available.length}
            items={columns.available}
            colId="available"
            onMove={(id: string) => moveStudent(id, "available", "shortlisted")}
            actionText="Shortlist"
          />
          
          {/* Column 2: Shortlisted */}
          <KanbanColumn 
            title="Shortlisted / Pending" 
            count={columns.shortlisted.length}
            items={columns.shortlisted}
            colId="shortlisted"
            onMove={(id: string) => moveStudent(id, "shortlisted", "team")}
            actionText="Accept"
            onReject={(id: string) => moveStudent(id, "shortlisted", "available")}
          />
          
          {/* Column 3: Active Roster */}
          <KanbanColumn 
            title="Active Roster" 
            count={columns.team.length}
            items={columns.team}
            colId="team"
            onReject={(id: string) => moveStudent(id, "team", "available")}
            actionText=""
          />
        </div>
      </LayoutGroup>
    </div>
  );
}

function KanbanColumn({ title, count, items, colId, onMove, actionText, onReject }: any) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col h-[600px]">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="bg-white/10 text-xs px-2.5 py-1 rounded-full">{count}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {items.map((item: any) => (
          <motion.div 
            layoutId={item.id}
            key={item.id}
            className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-electric-blue/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white">{item.name}</h4>
              <span className="text-xs text-electric-cyan bg-electric-cyan/10 px-2 py-0.5 rounded">{item.role}</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {item.skills.map((skill: string) => (
                <span key={skill} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2 justify-end">
              {onReject && item.id !== "s4" && (
                <button 
                  onClick={() => onReject(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              )}
              {onMove && (
                <button 
                  onClick={() => onMove(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-electric-blue hover:text-navy-900 rounded transition-colors text-white"
                >
                  {actionText}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8 border-2 border-dashed border-white/5 rounded-xl">
            Drop area empty
          </div>
        )}
      </div>
    </div>
  );
}
