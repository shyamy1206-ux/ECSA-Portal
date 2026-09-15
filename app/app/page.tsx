import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Award, Users, FileText, QrCode, Bell } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import RecommendedForYou from "@/components/ui/RecommendedForYou";
import { InterestsManager } from "@/components/personalization/InterestsManager";

export default async function StudentDashboard({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const tab = searchParams.tab || 'events';

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // Check if this user is a BOD member by matching their exact name
  let bodRole = null;
  const { data: bodMatch } = await supabase
    .from('bod_members')
    .select('post')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .maybeSingle();
  
  if (bodMatch) {
    bodRole = bodMatch.post;
  }

  // Fetch data for tabs
  let events = [];
  let clubs = [];
  let certificates = [];
  let applications = [];

  if (tab === 'events') {
    const { data } = await supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('student_id', session.user.id);
    events = data || [];
  } else if (tab === 'clubs') {
    const { data } = await supabase
      .from('club_memberships')
      .select('*, clubs(*)')
      .eq('student_id', session.user.id);
    clubs = data || [];
  } else if (tab === 'certificates') {
    const { data } = await supabase
      .from('certificates')
      .select('*, events(title)')
      .eq('user_id', session.user.id);
    certificates = data || [];
  } else if (tab === 'applications') {
    const { data } = await supabase
      .from('club_recruitment_applications')
      .select('*, role:club_recruitment_roles(title, drive:club_recruitment_drives(title, clubs(name)))')
      .eq('student_id', session.user.id);
    applications = data || [];
  }

  // Fetch recent notifications for sidebar
  const { data: recentNotifs } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Left Column: Passport & Notifications */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* ECSA Passport Card */}
        <div className={`glass p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden ${
          bodRole ? 'border-yellow-500/50 ' : 'border-white/10'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-br ${
            bodRole ? 'from-yellow-500/30' : 'from-electric-blue/20'
          } to-transparent`}></div>
          
          <div className={`w-24 h-24 rounded-full border-4 border-black flex items-center justify-center mb-4 z-10 relative overflow-hidden ${
            bodRole ? 'bg-yellow-500/20' : 'bg-electric-blue/10'
          }`}>
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className={`text-2xl font-bold ${bodRole ? 'text-yellow-400' : 'text-electric-cyan'}`}>
                {profile?.full_name?.charAt(0) || 'S'}
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-heading font-bold text-white mb-1 z-10">
            {profile?.full_name || 'Student'}
          </h2>
          <p className={`text-xs uppercase tracking-widest font-bold mb-6 z-10 ${
            bodRole ? 'text-yellow-400' : 'text-electric-cyan'
          }`}>
            {bodRole ? `${bodRole} - ECSA Board` : (profile?.department || 'General Member')}
          </p>
          
          <div className="w-full bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center border border-white/10 z-10 mb-4">
            <QrCode size={64} className="text-white/80 mb-2" />
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">ECSA-ID-{session.user.id.substring(0, 8)}</p>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-electric-magenta" />
            <h3 className="font-bold text-white">Recent Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {recentNotifs && recentNotifs.length > 0 ? (
              recentNotifs.map(notif => (
                <div key={notif.id} className="text-sm">
                  <p className={`font-medium ${notif.is_read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent alerts.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Tabbed Content */}
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">My Activities</h1>
        <p className="text-gray-400 mb-8">Manage your registrations, club roles, and applications.</p>

        <InterestsManager initialInterests={profile?.interests || []} />
        <RecommendedForYou />

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
          <Link 
            href="?tab=events" 
            className={`font-medium transition-colors ${tab === 'events' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
          >
            Registered Events
          </Link>
          <Link 
            href="?tab=clubs" 
            className={`font-medium transition-colors ${tab === 'clubs' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
          >
            My Clubs
          </Link>
          <Link 
            href="?tab=certificates" 
            className={`font-medium transition-colors ${tab === 'certificates' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
          >
            Certificates
          </Link>
          <Link 
            href="?tab=applications" 
            className={`font-medium transition-colors ${tab === 'applications' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
          >
            Applications
          </Link>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          
          {/* Events Tab */}
          {tab === 'events' && (
            events.length > 0 ? (
              events.map((reg: any) => (
                <div key={reg.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white mb-1">{reg.events?.title || 'Unknown Event'}</h3>
                    <p className="text-sm text-gray-400">Date: {reg.events?.date ? new Date(reg.events.date).toLocaleDateString() : 'TBA'}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${reg.status === 'registered' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {reg.status}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState 
                title="No events registered." 
                description="You haven't registered for any events yet. Check out the events page to find something interesting!" 
                icon={<Calendar size={32} />} 
                action={<Link href="/events" className="px-6 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">Browse Events</Link>}
              />
            )
          )}

          {/* Clubs Tab */}
          {tab === 'clubs' && (
            clubs.length > 0 ? (
              clubs.map((membership: any) => (
                <div key={membership.id} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">{membership.clubs?.name || 'Unknown Club'}</h3>
                    <p className="text-sm text-gray-400">Role: <span className="text-electric-cyan capitalize font-medium">{membership.role}</span></p>
                  </div>
                  <Link href={`/clubs/${membership.clubs?.slug}`} className="text-sm font-medium hover:text-white text-gray-400 transition-colors">
                    View Club &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState 
                title="No club memberships." 
                description="You aren't a member of any clubs. Visit the clubs directory to join one!" 
                icon={<Users size={32} />} 
                action={<Link href="/clubs" className="px-6 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">Browse Clubs</Link>}
              />
            )
          )}

          {/* Certificates Tab */}
          {tab === 'certificates' && (
            certificates.length > 0 ? (
              certificates.map((cert: any) => (
                <div key={cert.id} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">{cert.events?.title || 'Certificate'}</h3>
                    <p className="text-sm text-gray-400">Hash: <span className="font-mono text-xs text-white/50">{cert.verification_hash}</span></p>
                  </div>
                  <a href={cert.file_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-electric-blue hover:text-electric-cyan transition-colors">
                    View Document
                  </a>
                </div>
              ))
            ) : (
              <EmptyState 
                title="No certificates yet." 
                description="Attend certified events or workshops to earn certificates." 
                icon={<Award size={32} />} 
              />
            )
          )}

          {/* Applications Tab */}
          {tab === 'applications' && (
            applications.length > 0 ? (
              applications.map((app: any) => {
                const clubName = app.role?.drive?.clubs?.name || 'Unknown Club';
                const roleTitle = app.role?.title || 'Unknown Role';
                
                return (
                  <div key={app.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">{roleTitle}</h3>
                      <p className="text-sm text-gray-400">{clubName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <EmptyState 
                title="No active applications." 
                description="You haven't submitted any club recruitment applications recently." 
                icon={<FileText size={32} />} 
                action={<Link href="/clubs" className="px-6 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">Find Roles</Link>}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}


