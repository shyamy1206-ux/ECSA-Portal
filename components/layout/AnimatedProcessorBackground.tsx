"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useState } from "react";

export default function AnimatedProcessorBackground() {
  const [imageError, setImageError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.08, 1.16]
  );

  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-2, 0, 2]
  );

  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-1, 0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const reducedScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  const motionStyle = shouldReduceMotion
    ? { scale: reducedScale }
    : { scale, rotateY, rotateZ, y };

  return (
    <>
      <motion.div
        style={{
          ...motionStyle,
          perspective: 1400,
          transformOrigin: "center center",
        }}
        className="fixed inset-0 z-0 overflow-hidden transform-gpu will-change-transform"
      >
        {imageError ? (
          <div
            aria-label="Processor visual fallback"
            className="absolute inset-0 overflow-hidden bg-[#0a1020]"
          >
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,transparent_49%,#09d9ff_50%,transparent_51%),linear-gradient(0deg,transparent_49%,#09d9ff_50%,transparent_51%)] [background-size:70px_70px]" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] border border-cyan-400/50 bg-slate-900 shadow-[0_0_80px_rgba(0,210,255,0.35)]" />
          </div>
        ) : (
          <Image
            src="/media/processor-poster.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </motion.div>
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[#050816]/65" />
      <div className="fixed inset-0 z-[2] pointer-events-none bg-gradient-to-b from-[#050816]/80 via-transparent to-[#050816]/95" />
    </>
  );
}
