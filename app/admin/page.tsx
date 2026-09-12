import { createClient } from "@/lib/supabase/server";

export default async function AdminOverview() {
  const supabase = createClient();
  
  // Fetch high-level stats for the metric grid
  // In a real app, you would use .count({ exact: true }) on these queries
  
  // Example dummy stats for Phase 2 UI implementation
  const stats = [
    { label: "Total Registered Users", value: "24", color: "text-electric-blue" },
    { label: "Pending Club Approvals", value: "3", color: "text-electric-magenta" },
    { label: "Active Anonymous Ideas", value: "12", color: "text-electric-cyan" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">High-level metrics and recent moderation activity.</p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors"></div>
            <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-4xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-black/20 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4 text-white">Pending Approvals Queue</h3>
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-black/40 border border-electric-magenta/20 flex justify-between items-center">
               <div>
                 <p className="font-medium text-white text-sm">Robotics Club Registration</p>
                 <p className="text-xs text-gray-400">Submitted 2 hours ago</p>
               </div>
               <button className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors text-white">
                 Review
               </button>
             </div>
             <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex justify-between items-center">
               <div>
                 <p className="font-medium text-white text-sm">Event: Intro to AI</p>
                 <p className="text-xs text-gray-400">Submitted by CESA</p>
               </div>
               <button className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors text-white">
                 Review
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
