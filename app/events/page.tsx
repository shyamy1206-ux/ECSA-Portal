import MagneticButton from "@/components/ui/MagneticButton";
import { Calendar, MapPin, Users } from "lucide-react";

// Mock data for upcoming events
const EVENTS = [
  { 
    id: 1, 
    title: "AI & ML Workshop", 
    club: "SAAD", 
    date: "Oct 12, 2026", 
    time: "10:00 AM", 
    location: "Seminar Hall 1", 
    type: "Workshop",
    capacity: 120,
    registered: 85
  },
  { 
    id: 2, 
    title: "RoboWars 2026", 
    club: "EvolvtQ", 
    date: "Oct 18, 2026", 
    time: "09:00 AM", 
    location: "Main Campus Ground", 
    type: "Competition",
    capacity: 50,
    registered: 50
  },
  { 
    id: 3, 
    title: "Web3 & Blockchain Seminar", 
    club: "CESA", 
    date: "Nov 02, 2026", 
    time: "02:00 PM", 
    location: "Auditorium", 
    type: "Seminar",
    capacity: 200,
    registered: 110
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col relative z-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Campus Events</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover upcoming workshops, seminars, and hackathons hosted by ECSA and departmental clubs.
          </p>
        </div>
        <div className="flex gap-2">
          <select className="bg-black/40 border border-white/10 rounded-full px-6 py-2 text-sm focus:outline-none focus:border-electric-blue text-white appearance-none">
            <option value="all">All Event Types</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
            <option value="competition">Competitions</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {EVENTS.map((event) => {
          const isFull = event.registered >= event.capacity;
          
          return (
            <div key={event.id} className="glass p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-8 group hover:border-white/20 transition-colors">
              {/* Date Box */}
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-electric-blue font-bold uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                <span className="text-3xl font-heading font-bold text-white">{event.date.split(' ')[1].replace(',', '')}</span>
              </div>

              {/* Event Info */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 font-medium">
                    {event.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-electric-cyan/10 text-electric-cyan font-bold">
                    By {event.club}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-electric-blue transition-colors">
                  {event.title}
                </h2>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} /> {event.registered} / {event.capacity} Registered
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 flex items-center justify-center md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                <MagneticButton>
                  <button 
                    disabled={isFull}
                    className={`px-8 py-3 rounded-full font-semibold transition-colors
                      ${isFull 
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                        : 'bg-electric-blue text-navy-900 hover:bg-electric-cyan'}`
                    }
                  >
                    {isFull ? 'Waitlist Full' : 'Register Now'}
                  </button>
                </MagneticButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
