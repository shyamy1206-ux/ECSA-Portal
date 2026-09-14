import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Sparkles, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default async function RecommendedForYou() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  // Fetch student profile to get interests
  const { data: profile } = await supabase
    .from('profiles')
    .select('department, interests')
    .eq('id', session.user.id)
    .single();

  if (!profile) return null;

  const interests = profile.interests || [];
  const dept = profile.department || '';
  const shortDept = dept.split(' ')[0]; 

  // We'll search description for interests OR the department keyword
  const searchTerms = [...interests, shortDept].filter(Boolean);
  
  // Create an ilike condition for Supabase. e.g. "description.ilike.%AI%,description.ilike.%Web%"
  // Since Supabase doesn't easily support OR with dynamic ilike arrays directly via builder without raw strings,
  // we can use the `or` filter with a constructed string.
  const orCondition = searchTerms.map(term => `description.ilike.%${term}%`).join(',');
  const roleTitleOrCondition = searchTerms.map(term => `title.ilike.%${term}%`).join(',');

  let { data: recEvents } = await supabase
    .from('events')
    .select('id, title, date, type, clubs(slug, name)')
    .gte('date', new Date().toISOString())
    .or(orCondition || 'description.ilike.%dummy%')
    .limit(2);

  let { data: recRoles } = await supabase
    .from('club_recruitment_roles')
    .select('id, title, drive:club_recruitment_drives!inner(id, title, close_date, clubs(slug, name))')
    .eq('drive.status', 'published')
    .gte('drive.close_date', new Date().toISOString())
    .or(roleTitleOrCondition || 'title.ilike.%dummy%')
    .limit(2);

  // If no strict matches, gracefully fetch generic upcoming items
  let isStrictMatch = true;
  if ((!recEvents || recEvents.length === 0) && (!recRoles || recRoles.length === 0)) {
    isStrictMatch = false;
    const [fallbackEvents, fallbackRoles] = await Promise.all([
      supabase.from('events').select('id, title, date, type, clubs(slug, name)').gte('date', new Date().toISOString()).limit(2),
      supabase.from('club_recruitment_roles').select('id, title, drive:club_recruitment_drives!inner(id, title, close_date, clubs(slug, name))').eq('drive.status', 'published').gte('drive.close_date', new Date().toISOString()).limit(2)
    ]);
    recEvents = fallbackEvents.data;
    recRoles = fallbackRoles.data;
  }

  const hasRecommendations = (recEvents && recEvents.length > 0) || (recRoles && recRoles.length > 0);
  
  if (!hasRecommendations) return null;

  return (
    <div className="glass p-6 rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/10 to-transparent mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-electric-cyan animate-pulse" size={24} />
        <h2 className="text-xl font-bold text-white">
          {isStrictMatch ? (interests.length > 0 ? 'Picked for You' : `Recommended for ${dept} Students`) : 'Discover Opportunities'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recEvents && recEvents.map((event: any) => (
          <Link href={`/events/${event.id}`} key={event.id} className="block group">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-electric-blue transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-electric-violet/20 text-electric-violet">Upcoming Event</span>
                  {event.clubs && <span className="text-xs text-gray-400">{event.clubs.name}</span>}
                </div>
                <h3 className="font-bold text-white group-hover:text-electric-blue transition-colors mb-2">{event.title}</h3>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
                <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(event.date), "MMM d")}</span>
                <ChevronRight size={16} className="text-electric-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </Link>
        ))}

        {recRoles && recRoles.map((role: any) => (
          <Link href={`/clubs/${role.drive.clubs.slug}?drive=${role.drive.id}`} key={role.id} className="block group">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-electric-blue transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-electric-blue/20 text-electric-blue">Open Role</span>
                  {role.drive.clubs && <span className="text-xs text-gray-400">{role.drive.clubs.name}</span>}
                </div>
                <h3 className="font-bold text-white group-hover:text-electric-cyan transition-colors mb-2">{role.title}</h3>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
                <span className="flex items-center gap-1">Closes {format(new Date(role.drive.close_date), "MMM d")}</span>
                <span className="text-electric-cyan font-bold text-xs flex items-center group-hover:underline">Apply <ChevronRight size={14}/></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
