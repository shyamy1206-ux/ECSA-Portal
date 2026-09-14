"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function GalleryUploader({ eventId }: { eventId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setStatus("uploading");
    setUploadProgress(0);

    try {
      // 1. Ensure a gallery row exists for this event
      const { data: gallery, error: galleryError } = await supabase
        .from("event_galleries")
        .select("id")
        .eq("event_id", eventId)
        .single();

      let galleryId = gallery?.id;

      if (!gallery) {
        const { data: newGallery, error: insertErr } = await supabase
          .from("event_galleries")
          .insert({ event_id: eventId, status: "draft" })
          .select("id")
          .single();
          
        if (insertErr) throw insertErr;
        galleryId = newGallery.id;
      }

      // 2. Upload images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Compress
        const compressedBlob = await compressImage(file);
        
        // Upload to storage
        const imageId = crypto.randomUUID();
        const filePath = `events/${eventId}/gallery/${imageId}.jpg`;
        
        const { error: uploadErr } = await supabase.storage
          .from("event_galleries")
          .upload(filePath, compressedBlob, { contentType: "image/jpeg" });

        if (uploadErr) throw uploadErr;

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from("event_galleries")
          .getPublicUrl(filePath);

        // Insert into event_gallery_images
        const { error: dbErr } = await supabase
          .from("event_gallery_images")
          .insert({
            gallery_id: galleryId,
            image_url: publicUrlData.publicUrl,
            caption: "",
            is_cover: i === 0 && !gallery, // First uploaded image becomes cover if new gallery
            display_order: i
          });

        if (dbErr) throw dbErr;

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setStatus("success");
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to upload images.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${files.length > 0 ? "border-electric-blue bg-electric-blue/5" : "border-white/20 hover:border-white/40 bg-black/20"}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <Upload className="text-gray-400 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Drag and drop photos</h3>
          <p className="text-sm text-gray-400">or click to browse from your computer (JPG, PNG)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Selected Files ({files.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload and Compress'}
            </button>
            <button 
              onClick={() => setFiles([])}
              disabled={isUploading}
              className="px-6 py-2 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} />
          <p>Successfully uploaded all photos. Gallery is currently saved as Draft.</p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
