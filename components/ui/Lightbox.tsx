"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface Image {
  id: string;
  image_url: string;
  caption?: string;
}

interface LightboxProps {
  images: Image[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-10"
          aria-label="Close lightbox"
        >
          <X size={32} />
        </button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hidden md:block z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={48} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hidden md:block z-10"
              aria-label="Next image"
            >
              <ChevronRight size={48} />
            </button>
          </>
        )}

        {/* Image Display */}
        <div className="relative w-full max-w-6xl max-h-[85vh] flex flex-col items-center justify-center px-4 md:px-24">
          <motion.div
            key={currentIndex}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.image_url}
              alt={currentImage.caption || "Event gallery image"}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              loading="lazy"
            />
            {currentImage.caption && (
              <div className="absolute -bottom-12 left-0 w-full text-center">
                <p className="text-gray-300 text-lg">{currentImage.caption}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Thumbnails (Mobile & Desktop) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                  idx === currentIndex ? "border-2 border-electric-cyan opacity-100" : "border border-white/20 opacity-40 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
