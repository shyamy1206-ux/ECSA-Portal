import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import EventGallerySection from "@/components/ui/EventGallerySection";
import { ViewTracker } from "@/components/ui/ViewTracker";
import { RegisterButton } from "@/components/events/RegisterButton";

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

  const eventDate = new Date(event.date);
  const isFull = event.capacity ? event.registered_count >= event.capacity : false;
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <ViewTracker contentType="event" contentId={event.id} />
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
              {event.description?.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          <EventGallerySection eventId={event.id} />
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
              <RegisterButton eventId={event.id} isPast={isPast} isFull={isFull} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
