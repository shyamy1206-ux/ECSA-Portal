"use client";

import { useState } from "react";
import { Image as ImageIcon, X, UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function GalleryManager({ galleries, events }: { galleries: any[], events: any[] }) {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent || files.length === 0) return alert("Please select an event and add photos.");
    setIsUploading(true);

    // 1. Get user id
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Create the gallery album first
    const { data: gallery, error: galleryError } = await supabase
      .from('event_galleries')
      .insert({ event_id: selectedEvent, created_by: user?.id, status: 'published' })
      .select()
      .single();

    if (galleryError) {
      alert("Error creating album: " + galleryError.message);
      setIsUploading(false);
      return;
    }

    // 3. Upload all photos
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${gallery.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-photos')
        .upload(fileName, file);
        
      if (!uploadError) {
        // Save to event_gallery_images table
        await supabase.from('event_gallery_images').insert({
          gallery_id: gallery.id,
          image_url: fileName
        });
      }
    }

    setIsUploading(false);
    setIsModalOpen(false);
    window.location.reload(); // Quick refresh to show new album
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Event Galleries</h2>
          <p className="text-gray-400 text-sm">Upload, organize, and publish event photos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-medium rounded-lg hover:bg-electric-cyan transition-colors"
        >
          <ImageIcon size={18} /> New Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries && galleries.length > 0 ? (
          galleries.map((gallery: any) => (
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Create New Album</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAlbum} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Link to Event</label>
                <select 
                  required
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="" disabled>Select an event...</option>
                  {events?.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Upload Photos</label>
                <div className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-electric-blue transition-colors cursor-pointer bg-navy-800/20">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden" 
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-electric-blue mb-3" />
                    <span className="text-white font-medium">Click to browse files</span>
                    <span className="text-xs text-gray-400 mt-1">{files.length} files selected</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
                >
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {isUploading ? "Uploading..." : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
