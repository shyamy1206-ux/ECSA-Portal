import { createClient } from "@/lib/supabase/server";
import GalleryManager from "./GalleryManager";

export default async function EventGalleryPage() {
  const supabase = createClient();
  
  const { data: galleries } = await supabase
    .from('event_galleries')
    .select('*, events(title, date), event_gallery_images(image_url, is_cover)')
    .order('created_at', { ascending: false });

  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .order('date', { ascending: false });

  return <GalleryManager galleries={galleries || []} events={events || []} />;
}
