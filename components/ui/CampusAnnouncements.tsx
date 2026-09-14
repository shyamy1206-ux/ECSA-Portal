import { createClient } from "@/lib/supabase/server";
import { AnnouncementTicker } from "./AnnouncementTicker";

export default async function CampusAnnouncements() {
  const supabase = createClient();
  
  // Fetch active, published announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, priority, created_at')
    .eq('status', 'published')
    .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
    .order('created_at', { ascending: false });

  // Do not render the component at all if there are no announcements
  if (!announcements || announcements.length === 0) {
    return null;
  }

  return <AnnouncementTicker announcements={announcements} />;
}
