"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

interface RealtimeContextType {
  supabase: SupabaseClient | null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  supabase: null,
  isConnected: false,
});

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Establish a base connection to multiplex channels over
    const systemChannel = supabase.channel('system_status');
    
    systemChannel
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(systemChannel);
    };
  }, [supabase]);

  return (
    <RealtimeContext.Provider value={{ supabase, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeClient() {
  return useContext(RealtimeContext);
}
