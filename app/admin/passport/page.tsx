import { createClient } from "@/lib/supabase/server";
import { Search, ShieldCheck, AlertTriangle, Calendar, Users, Award, QrCode } from "lucide-react";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function PassportAdminPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  let rawId = searchParams.id || '';
  let studentId = rawId;

  // Handle 'ECSA-ID-[uuid]' format from QR scanners
  if (rawId.startsWith('ECSA-ID-')) {
    studentId = rawId.replace('ECSA-ID-', '');
  }

  let profile = null;
  let events = [];
  let clubs = [];
  let certificates = [];
  let searchError = null;

  if (studentId) {
    // Basic UUID validation before querying to prevent DB errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // We only have the first 8 characters from the QR code!
    // The passport only generates ECSA-ID-[first-8-chars] for now.
    // So we need to query the profile using `id.ilike.${studentId}%`
    
    if (studentId.length >= 8) {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('id', `${studentId}%`)
        .limit(1);
        
      if (profiles && profiles.length > 0) {
        profile = profiles[0];
        
        // Fetch relations
        const [eventsRes, clubsRes, certsRes] = await Promise.all([
          supabase.from('event_registrations').select('*, events(*)').eq('student_id', profile.id),
          supabase.from('club_memberships').select('*, clubs(*)').eq('student_id', profile.id),
          supabase.from('certificates').select('*, events(title)').eq('user_id', profile.id)
        ]);

        events = eventsRes.data || [];
        clubs = clubsRes.data || [];
        certificates = certsRes.data || [];
      } else {
        searchError = "No student found with that ID segment.";
      }
    } else {
      searchError = "ID segment too short. Provide at least 8 characters.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Passport Verification</h2>
          <p className="text-gray-400 text-sm">Scan or enter an ECSA-ID to verify student records.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10 mb-8">
        <form className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              name="id" 
              defaultValue={rawId}
              placeholder="Enter ECSA-ID or UUID (e.g., ECSA-ID-a1b2c3d4)" 
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono"
              autoFocus
            />
          </div>
          <button type="submit" className="px-8 py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors whitespace-nowrap">
            Verify Student
          </button>
        </form>
        {searchError && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3">
            <AlertTriangle size={20} />
            <p>{searchError}</p>
          </div>
        )}
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl border border-electric-cyan/30 flex flex-col items-center text-center relative overflow-hidden bg-electric-cyan/5">
              <div className="absolute top-4 right-4">
                <ShieldCheck className="text-electric-cyan" size={32} />
              </div>
              
              <div className="w-24 h-24 rounded-full border-4 border-electric-cyan/30 bg-black/50 flex items-center justify-center mb-4 overflow-hidden">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-electric-cyan">
                    {profile.full_name?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-heading font-bold text-white mb-1">{profile.full_name}</h2>
              <p className="text-sm text-electric-cyan uppercase tracking-widest font-bold mb-4">{profile.department}</p>
              
              <div className="w-full p-3 bg-black/50 rounded-lg border border-white/10 flex flex-col items-center gap-1 font-mono text-xs text-gray-400">
                <QrCode size={16} className="text-gray-500 mb-1" />
                <span>ID: {profile.id.substring(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Records */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="text-electric-cyan" size={18} /> Event History
              </h3>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map((reg: any) => (
                    <div key={reg.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-medium text-white">{reg.events?.title || 'Unknown Event'}</p>
                        <p className="text-xs text-gray-500">{reg.events?.date ? format(new Date(reg.events.date), "MMM d, yyyy") : 'TBA'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${reg.status === 'registered' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {reg.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No event registrations found.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-electric-cyan" size={18} /> Club Memberships
                </h3>
                <div className="space-y-3">
                  {clubs.length > 0 ? (
                    clubs.map((club: any) => (
                      <div key={club.id} className="py-2 border-b border-white/5 last:border-0">
                        <p className="font-medium text-white">{club.clubs?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{club.role}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No active memberships.</p>
                  )}
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="text-electric-cyan" size={18} /> Certificates
                </h3>
                <div className="space-y-3">
                  {certificates.length > 0 ? (
                    certificates.map((cert: any) => (
                      <div key={cert.id} className="py-2 border-b border-white/5 last:border-0">
                        <p className="font-medium text-white">{cert.events?.title}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{cert.verification_hash}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No certificates earned.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
