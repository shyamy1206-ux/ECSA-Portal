"use client";

import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface Image {
  id: string;
  image_url: string;
  caption?: string;
  is_cover: boolean;
}

export function EventGalleryViewer({ images }: { images: Image[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="mt-12 p-8 border border-white/10 rounded-3xl bg-black/20 text-center">
        <p className="text-gray-400">No event photos have been uploaded yet.</p>
      </div>
    );
  }

  // Find the cover image or default to the first one
  const coverImageIndex = images.findIndex((img) => img.is_cover);
  const coverIndex = coverImageIndex >= 0 ? coverImageIndex : 0;
  const coverImage = images[coverIndex];
  
  // Get up to 4 other images for the grid
  const gridImages = images.filter((_, idx) => idx !== coverIndex).slice(0, 4);

  return (
    <>
      <div className="mt-12 space-y-4">
        <h3 className="text-2xl font-heading font-bold text-white mb-6">Event Gallery</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-h-[500px]">
          {/* Main Cover Image */}
          <div 
            className="md:col-span-3 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-2xl h-[300px] md:h-[500px]"
            onClick={() => setLightboxIndex(coverIndex)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={coverImage.image_url} 
              alt={coverImage.caption || "Event cover"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white font-medium">{coverImage.caption}</p>
            </div>
          </div>

          {/* Grid Images */}
          {gridImages.map((img, idx) => {
            const originalIndex = images.findIndex((i) => i.id === img.id);
            const isLastGridItem = idx === 3 && images.length > 5;
            const remainingCount = images.length - 5;

            return (
              <div 
                key={img.id}
                className="relative group cursor-pointer overflow-hidden rounded-2xl h-[150px] md:h-auto"
                onClick={() => setLightboxIndex(originalIndex)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.image_url} 
                  alt={img.caption || "Event photo"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {isLastGridItem ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white text-xl font-bold">+{remainingCount}</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox 
          images={images} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </>
  );
}
