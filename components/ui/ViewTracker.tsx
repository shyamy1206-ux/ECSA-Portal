"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  contentType: "club" | "event" | "opportunity";
  contentId: string;
}

export function ViewTracker({ contentType, contentId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (tracked.current) return;
    tracked.current = true;

    // Use fetch with keepalive to ensure it fires even if user navigates away quickly
    fetch('/api/engage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType, contentId }),
      keepalive: true
    }).catch(console.error); // Silent fail on tracking
  }, [contentType, contentId]);

  return null; // Invisible component
}
