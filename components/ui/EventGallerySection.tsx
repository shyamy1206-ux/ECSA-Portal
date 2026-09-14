import { createClient } from "@/lib/supabase/server";
import { EventGalleryViewer } from "./EventGalleryViewer";

export default async function EventGallerySection({ eventId }: { eventId: string }) {
  const supabase = createClient();
  
  // RLS will ensure we only see 'published' galleries and their images
  const { data: gallery } = await supabase
    .from('event_galleries')
    .select(`
      id,
      images:event_gallery_images (
        id,
        image_url,
        caption,
        is_cover,
        display_order
      )
    `)
    .eq('event_id', eventId)
    .single();

  if (!gallery || !gallery.images || gallery.images.length === 0) {
    return (
      <div className="mt-12 p-8 border border-white/10 rounded-3xl bg-black/20 text-center">
        <p className="text-gray-400">No event photos have been uploaded yet.</p>
      </div>
    );
  }

  // Sort images by display_order
  const sortedImages = gallery.images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return <EventGalleryViewer images={sortedImages} />;
}
