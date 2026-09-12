import { createClient } from "@/lib/supabase/server";
import { Calendar, MapPin, Users, Image as ImageIcon } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default async function EventGalleryPage() {
  const supabase = createClient();
  
  const { data: galleries } = await supabase
    .from('event_galleries')
    .select('*, events(title, date)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Event Galleries</h2>
          <p className="text-gray-400 text-sm">Upload, organize, and publish event photos.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-medium rounded-lg hover:bg-electric-cyan transition-colors">
          <ImageIcon size={18} /> New Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries && galleries.length > 0 ? (
          galleries.map((gallery) => (
            <div key={gallery.id} className="glass p-4 rounded-2xl border border-white/5 flex flex-col group">
               <div className="w-full h-40 bg-black/40 rounded-xl mb-4 border border-white/5 flex items-center justify-center text-gray-600">
                  <ImageIcon size={32} />
               </div>
               <h3 className="font-bold text-white mb-1">{gallery.events?.title || 'Unknown Event'}</h3>
               <p className="text-xs text-gray-400 mb-4">{new Date(gallery.events?.date).toLocaleDateString()}</p>
               <div className="flex justify-between items-center mt-auto">
                 <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${gallery.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                   {gallery.status}
                 </span>
                 <button className="text-xs text-electric-blue hover:text-electric-cyan transition-colors">Manage Photos</button>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full glass p-12 rounded-2xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[300px]">
             <ImageIcon size={48} className="text-gray-600 mb-4" />
             <h3 className="text-lg font-bold text-white mb-2">No Photo Galleries</h3>
             <p className="text-sm text-gray-400 max-w-sm">Create your first album to upload event photos using drag and drop.</p>
          </div>
        )}
      </div>
    </div>
  );
}
