import { createStaticClient } from "@/lib/supabase/static";
import MagneticButton from "@/components/ui/MagneticButton";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function EventsPage() {
  const supabase = createStaticClient();
  
  // Fetch real events from Supabase
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name, slug)')
    .order('date', { ascending: true })
    .gte('date', new Date().toISOString());

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col relative z-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Campus Events</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover upcoming workshops, seminars, and hackathons hosted by ECSA and departmental clubs.
          </p>
        </div>

      </div>

      <div className="space-y-6">
        {events && events.length > 0 ? (
          events.map((event: any) => {
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString('default', { month: 'short' });
            const day = eventDate.getDate();
            const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // We use capacity logic if implemented, otherwise default to active
            const isFull = event.capacity ? event.registered_count >= event.capacity : false;
            
            return (
              <div key={event.id} className="glass p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-8 group hover:border-white/20 transition-colors">
                {/* Date Box */}
                <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-electric-blue font-bold uppercase tracking-widest">{month}</span>
                  <span className="text-3xl font-heading font-bold text-white">{day}</span>
                </div>

                {/* Event Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 font-medium capitalize">
                      {event.type || 'Event'}
                    </span>
                    {event.clubs && (
                      <Link href={`/clubs/${event.clubs.slug}`} className="text-xs px-2 py-1 rounded bg-electric-cyan/10 text-electric-cyan font-bold hover:bg-electric-cyan/20 transition-colors">
                        By {event.clubs.name}
                      </Link>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 max-w-2xl">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> {time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} /> {event.location || 'TBA'}
                    </div>
                    {event.capacity && (
                       <div className="flex items-center gap-2">
                         <Users size={16} /> {event.registered_count || 0} / {event.capacity} Registered
                       </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 flex items-center justify-center md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                  <MagneticButton>
                    <Link 
                      href={`/events/${event.id}`}
                      className={`px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center text-center
                        ${isFull 
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed pointer-events-none' 
                          : 'bg-electric-blue text-navy-900 hover:bg-electric-cyan'}`
                      }
                    >
                      {isFull ? 'Waitlist Full' : 'View Details'}
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState 
            title="To be announced."
            description="Our club coordinators are planning something great. Check back soon!"
            icon={<Calendar size={32} />}
          />
        )}
      </div>
    </div>
  );
}


