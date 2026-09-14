"use client";

import { useEffect, useRef } from "react";
import { useRealtimeClient } from "@/components/providers/RealtimeProvider";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type AllowedRealtimeTables = 'announcements' | 'notifications';

export function useRealtime(
  table: AllowedRealtimeTables,
  callback: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => void,
  filter?: string,
  enabled: boolean = true
) {
  const { supabase, isConnected } = useRealtimeClient();
  const callbackRef = useRef(callback);

  // Keep callback ref updated to avoid re-subscribing on every render if callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!supabase || !enabled) return;

    // Supabase multiplexes over a single WebSocket connection
    const channelName = `public:${table}${filter ? `:${filter}` : ''}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table, filter: filter },
        (payload) => {
          if (callbackRef.current) {
            callbackRef.current(payload);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`[Realtime] Failed to subscribe to ${channelName}:`, err || status);
        }
      });

    return () => {
      // Clean up the channel specifically when the component unmounts
      supabase.removeChannel(channel);
    };
  }, [supabase, table, filter, enabled]);

  return { isConnected };
}
