"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useActiveStorySection } from "./ScrollStoryContext";

type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function ScrollStorySection({ id, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 }); // Trigger when 40% in view
  const { setActiveChapter } = useActiveStorySection();

  useEffect(() => {
    if (isInView) {
      setActiveChapter(id);
    }
  }, [isInView, id, setActiveChapter]);

  return (
    <div ref={ref} id={id} className={`relative z-10 w-full min-h-screen ${className}`}>
      {children}
    </div>
  );
}
