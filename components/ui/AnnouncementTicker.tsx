"use client";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useReducedMotion } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  priority: string;
  created_at: string;
}

export function AnnouncementTicker({ announcements }: { announcements: Announcement[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const tickerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fallback to CSS animation if reduced motion is disabled
  useEffect(() => {
    if (shouldReduceMotion || !tickerRef.current || isHovered) return;
    
    let animationFrameId: number;
    let currentPos = scrollPosition;

    const scroll = () => {
      currentPos -= 0.5; // speed
      
      // Reset position when we've scrolled the full width of one set of items
      if (tickerRef.current) {
        if (Math.abs(currentPos) >= tickerRef.current.scrollWidth / 2) {
          currentPos = 0;
        }
        tickerRef.current.style.transform = `translateX(${currentPos}px)`;
      }
      
      setScrollPosition(currentPos);
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    
    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion, isHovered]);

  if (!announcements || announcements.length === 0) return null;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="text-red-400 shrink-0" size={16} />;
      case 'medium': return <AlertCircle className="text-yellow-400 shrink-0" size={16} />;
      default: return <Info className="text-electric-cyan shrink-0" size={16} />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return "border-red-500/30 bg-red-500/10";
      case 'medium': return "border-yellow-500/30 bg-yellow-500/10";
      default: return "border-electric-blue/30 bg-electric-blue/10";
    }
  };

  // Duplicate items for seamless scrolling if motion is allowed
  const displayItems = shouldReduceMotion ? announcements : [...announcements, ...announcements];

  return (
    <div className="w-full bg-navy-900 border-y border-white/10 overflow-hidden relative z-40 py-3">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="shrink-0 px-4 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white mr-4 z-20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse"></span>
          Campus Updates
        </div>
        
        <div 
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {shouldReduceMotion ? (
            // Static grid for reduced motion
            <div className="flex flex-wrap gap-4">
              {displayItems.map((item) => (
                <div key={item.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${getPriorityStyle(item.priority)}`}>
                  {getPriorityIcon(item.priority)}
                  <span className="font-semibold text-white whitespace-nowrap">{item.title}</span>
                  {item.content && <span className="text-gray-400 hidden md:inline truncate max-w-xs">- {item.content}</span>}
                </div>
              ))}
            </div>
          ) : (
            // Animated ticker
            <div className="flex w-max gap-8" ref={tickerRef}>
              {displayItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className={`flex items-center gap-3 px-4 py-2 rounded-full border text-sm transition-opacity hover:opacity-100 ${isHovered ? 'opacity-100' : 'opacity-80'} ${getPriorityStyle(item.priority)}`}>
                  {getPriorityIcon(item.priority)}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white whitespace-nowrap">{item.title}</span>
                    {item.content && <span className="text-gray-400 hidden md:inline whitespace-nowrap truncate max-w-sm">- {item.content}</span>}
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{format(new Date(item.created_at), "MMM d")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
