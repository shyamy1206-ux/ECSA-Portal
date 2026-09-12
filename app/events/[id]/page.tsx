import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Image as ImageIcon } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";

export const revalidate = 60;

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // Fetch event details
  const { data: event } = await supabase
    .from('events')
    .select('*, clubs(name, slug)')
    .eq('id', params.id)
    .single();

  if (!event) {
    notFound();
  }

  // Fetch galleries for this event
  const { data: gallery } = await supabase
    .from('event_galleries')
    .select('id, status')
    .eq('event_id', event.id)
    .eq('status', 'published')
    .single();

  let images = [];
  if (gallery) {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', gallery.id)
      .order('sort_order', { ascending: true });
    images = data || [];
  }

  const eventDate = new Date(event.date);
  const isFull = event.capacity ? event.registered_count >= event.capacity : false;
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/events" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
          &larr; Back to Events
        </Link>
        <div className="flex gap-2 items-center mb-4">
          <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 font-medium capitalize">
            {event.type || 'Event'}
          </span>
          {event.clubs && (
            <Link href={`/clubs/${event.clubs.slug}`} className="text-xs px-2 py-1 rounded bg-electric-cyan/10 text-electric-cyan font-bold hover:bg-electric-cyan/20 transition-colors">
              Hosted by {event.clubs.name}
            </Link>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">{event.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">About this Event</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              {event.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          {images.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="text-electric-blue" /> Event Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img: any) => (
                  <div key={img.id} className="aspect-square rounded-xl bg-black/40 border border-white/5 overflow-hidden relative group">
                     {/* In a real scenario, map storage_path to public URL */}
                     <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-white/5">
                        <ImageIcon size={24} />
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="text-electric-cyan mt-1" size={20} />
                <div>
                  <p className="font-bold text-white">{eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-gray-400">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-electric-cyan mt-1" size={20} />
                <div>
                  <p className="font-bold text-white">{event.location || 'Location TBA'}</p>
                </div>
              </div>
              {event.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="text-electric-cyan mt-1" size={20} />
                  <div>
                    <p className="font-bold text-white">{event.registered_count || 0} / {event.capacity} Registered</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <MagneticButton>
                <button 
                  disabled={isPast || isFull}
                  className={`w-full py-4 rounded-xl font-bold text-center transition-colors ${
                    isPast ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
                    isFull ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
                    'bg-white text-navy-900 hover:bg-electric-blue'
                  }`}
                >
                  {isPast ? 'Event Ended' : isFull ? 'Registration Full' : 'Register Now'}
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
