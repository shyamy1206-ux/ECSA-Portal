import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Award, FolderGit2, Users } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto pb-20">
      <h1 className="text-3xl font-heading font-bold text-white mb-2">ECSA Passport</h1>
      <p className="text-gray-400 mb-8">Welcome back, {profile?.full_name || 'Student'}. Here is your campus activity overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Profile Card */}
        <div className="glass p-6 rounded-3xl border border-white/10 md:col-span-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center text-3xl font-bold text-electric-blue mb-4">
            {profile?.full_name?.charAt(0) || 'S'}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{profile?.full_name}</h2>
          <p className="text-sm text-electric-cyan font-mono mb-4">{profile?.email}</p>
          <div className="w-full pt-4 border-t border-white/5 text-sm text-gray-400 flex justify-between">
            <span>Role</span>
            <span className="capitalize text-white">{profile?.role || 'Student'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-white/10 transition-colors">
            <Calendar size={24} className="text-gray-500 mb-3" />
            <span className="text-3xl font-heading font-bold text-white mb-1">0</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Events Attended</span>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-white/10 transition-colors">
            <Users size={24} className="text-gray-500 mb-3" />
            <span className="text-3xl font-heading font-bold text-white mb-1">0</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Club Memberships</span>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-white/10 transition-colors">
            <FolderGit2 size={24} className="text-gray-500 mb-3" />
            <span className="text-3xl font-heading font-bold text-white mb-1">0</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Projects</span>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-white/10 transition-colors">
            <Award size={24} className="text-gray-500 mb-3" />
            <span className="text-3xl font-heading font-bold text-white mb-1">0</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Certificates</span>
          </div>
        </div>
      </div>
      
      {/* Pending Applications or Registrations */}
      <h3 className="text-xl font-heading font-bold text-white mb-4">Recent Activity</h3>
      <div className="glass p-8 rounded-3xl border border-white/5 text-center text-gray-500">
        You don&apos;t have any recent activity. Register for an event or apply to a club to see updates here!
      </div>
    </div>
  );
}
