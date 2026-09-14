import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Calendar, FolderGit2, Lightbulb, Award, Megaphone, Briefcase, HelpCircle } from "lucide-react";

export default async function AdminOverview() {
  const supabase = createClient();

  // Fetch real counts in parallel
  const [
    { count: userCount },
    { count: clubCount },
    { count: eventCount },
    { count: projectCount },
    { count: ideaCount },
    { count: certCount },
    { count: oppCount },
    { count: requestCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('clubs').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('ideas').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('service_requests').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: "Registered Users", value: userCount ?? 0, icon: <Users size={20} />, color: "text-electric-blue", href: "/admin/users" },
    { label: "Clubs", value: clubCount ?? 0, icon: <Users size={20} />, color: "text-electric-violet", href: "/admin/clubs" },
    { label: "Events", value: eventCount ?? 0, icon: <Calendar size={20} />, color: "text-electric-cyan", href: "/admin/events" },
    { label: "Projects", value: projectCount ?? 0, icon: <FolderGit2 size={20} />, color: "text-green-400", href: "/admin/projects" },
    { label: "Ideas", value: ideaCount ?? 0, icon: <Lightbulb size={20} />, color: "text-yellow-400", href: "/admin/ideas" },
    { label: "Certificates", value: certCount ?? 0, icon: <Award size={20} />, color: "text-electric-magenta", href: "/admin/certificates" },
    { label: "Opportunities", value: oppCount ?? 0, icon: <Briefcase size={20} />, color: "text-orange-400", href: "/admin/opportunities" },
    { label: "Service Requests", value: requestCount ?? 0, icon: <HelpCircle size={20} />, color: "text-red-400", href: "/admin/helpdesk" },
  ];

  // Fetch recent activity (announcements, last 5)
  const { data: recentAnnouncements } = await supabase
    .from('announcements')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch pending approvals
  const { data: pendingClubs } = await supabase
    .from('clubs')
    .select('id, name, created_at')
    .eq('status', 'pending')
    .limit(5);

  const { data: pendingOpps } = await supabase
    .from('opportunities')
    .select('id, title, created_at')
    .eq('status', 'pending')
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Real-time platform metrics and moderation queue.</p>
      </div>


      {/* Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="glass p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 border border-transparent transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className={stat.color}>{stat.icon}</span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className={`text-3xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Announcements</h3>
            <Link href="/admin/announcements" className="text-xs text-electric-blue hover:underline">View All</Link>
          </div>
          {recentAnnouncements && recentAnnouncements.length > 0 ? (
            <div className="space-y-3">
              {recentAnnouncements.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div>
                    <p className="font-medium text-white text-sm">{a.title}</p>
                    <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    a.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">No announcements yet.</p>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4 text-white">Pending Approvals</h3>
          <div className="space-y-3">
            {pendingClubs && pendingClubs.length > 0 && pendingClubs.map((c: any) => (
              <Link key={c.id} href="/admin/clubs" className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">Club Registration</p>
                </div>
                <span className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded text-white">Review</span>
              </Link>
            ))}
            {pendingOpps && pendingOpps.length > 0 && pendingOpps.map((o: any) => (
              <Link key={o.id} href="/admin/opportunities" className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{o.title}</p>
                  <p className="text-xs text-gray-500">Opportunity Listing</p>
                </div>
                <span className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded text-white">Review</span>
              </Link>
            ))}
            {(!pendingClubs || pendingClubs.length === 0) && (!pendingOpps || pendingOpps.length === 0) && (
              <p className="text-sm text-gray-500 py-4 text-center">No pending approvals. 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


