"use client";

import { useState } from "react";
import { Image as ImageIcon, X, UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";

export default function GalleryManager({ galleries, events }: { galleries: any[], events: any[] }) {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Allowed file types
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast(`${file.name} is not a supported format. Please use JPG, PNG, or WebP.`, "error");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast(`${file.name} is too large. Maximum size is 5MB.`, "error");
        continue;
      }
      validFiles.push(file);
    }
    
    setFiles(validFiles);
  };

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent) return toast("Please select an event.", "error");
    if (files.length === 0) return toast("Please add at least one valid photo.", "error");
    
    setIsUploading(true);

    try {
      // 1. Get user id for auth verification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You must be logged in to upload photos.");

      // 2. Upsert the gallery album (in case it already exists for this event)
      // Note: Unique constraint on event_id means we should check first or handle conflict
      let galleryId = "";
      
      const { data: existingGallery } = await supabase
        .from('event_galleries')
        .select('id')
        .eq('event_id', selectedEvent)
        .maybeSingle();

      if (existingGallery) {
        galleryId = existingGallery.id;
      } else {
        const { data: newGallery, error: galleryError } = await supabase
          .from('event_galleries')
          .insert({ event_id: selectedEvent, created_by: user.id, status: 'published' })
          .select('id')
          .single();
          
        if (galleryError) throw new Error("Failed to create gallery: " + galleryError.message);
        galleryId = newGallery.id;
      }

      // 3. Upload all photos
      let uploadedCount = 0;
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `event-galleries/${selectedEvent}/${user.id}/${uniqueFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-photos')
          .upload(filePath, file);
          
        if (uploadError) {
          toast(`Failed to upload ${file.name}: ${uploadError.message}`, "error");
          continue; // Try the next file
        }

        // Save to event_gallery_images table
        const { error: dbError } = await supabase.from('event_gallery_images').insert({
          gallery_id: galleryId,
          image_url: filePath
        });

        if (dbError) {
          toast(`Failed to link ${file.name} to database.`, "error");
        } else {
          uploadedCount++;
        }
      }

      if (uploadedCount > 0) {
        toast(`Successfully uploaded ${uploadedCount} photos!`, "success");
        setIsModalOpen(false);
        setFiles([]);
        setSelectedEvent("");
        window.location.reload();
      } else {
        throw new Error("No photos were successfully uploaded.");
      }

    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  }

  // Helper to get image URL for the cover photo
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    const { data } = supabase.storage.from('gallery-photos').getPublicUrl(path);
    return data.publicUrl;
  };

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
          galleries.map((gallery: any) => {
            // Find cover image or first image
            const coverImage = gallery.event_gallery_images?.find((img: any) => img.is_cover) 
              || gallery.event_gallery_images?.[0];
            const coverUrl = coverImage ? getImageUrl(coverImage.image_url) : null;

            return (
              <div key={gallery.id} className="glass p-4 rounded-2xl border border-white/5 flex flex-col group">
                 <div className="w-full h-40 bg-black/40 rounded-xl mb-4 border border-white/5 flex items-center justify-center text-gray-600 relative overflow-hidden">
                    {coverUrl ? (
                      <Image src={coverUrl} alt="Gallery Cover" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 300px" />
                    ) : (
                      <ImageIcon size={32} />
                    )}
                 </div>
                 <h3 className="font-bold text-white mb-1 line-clamp-1">{gallery.events?.title || 'Unknown Event'}</h3>
                 <p className="text-xs text-gray-400 mb-4">{new Date(gallery.events?.date).toLocaleDateString()}</p>
                 <div className="flex justify-between items-center mt-auto">
                   <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${gallery.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                     {gallery.status}
                   </span>
                   <button className="text-xs text-electric-blue hover:text-electric-cyan transition-colors">
                     Manage Photos
                   </button>
                 </div>
              </div>
            )
          })
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
              <button 
                onClick={() => !isUploading && setIsModalOpen(false)} 
                className="text-gray-400 hover:text-white disabled:opacity-50"
                disabled={isUploading}
              >
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
                  disabled={isUploading}
                  className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue disabled:opacity-50"
                >
                  <option value="" disabled>Select an event...</option>
                  {events?.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Upload Photos (Max 5MB each)</label>
                <div className={`w-full border-2 border-dashed border-white/20 rounded-xl p-8 text-center transition-colors bg-navy-800/20 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-electric-blue cursor-pointer'
                }`}>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={handleFileSelect}
                    className="hidden" 
                    id="photo-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="photo-upload" className={`flex flex-col items-center ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <UploadCloud className="w-10 h-10 text-electric-blue mb-3" />
                    <span className="text-white font-medium">Click to browse files</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {files.length > 0 ? `${files.length} valid files selected` : 'Supports JPG, PNG, WebP'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isUploading}
                  className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || files.length === 0 || !selectedEvent}
                  className="flex items-center gap-2 px-6 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
                >
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload Photos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
