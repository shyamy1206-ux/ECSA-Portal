"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export function RegisterButton({ eventId, isPast, isFull }: { eventId: string, isPast: boolean, isFull: boolean }) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast("You must be logged in to register.", "error");
        return;
      }

      const { error } = await supabase.from('event_registrations').insert({
        event_id: eventId,
        student_id: user.id,
        status: 'registered'
      });

      if (error) {
        if (error.code === '23505') {
          toast("You are already registered for this event!", "info");
          setRegistered(true);
        } else {
          throw error;
        }
      } else {
        toast("Successfully registered!", "success");
        setRegistered(true);
      }
    } catch (e: any) {
      toast("Failed to register: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full py-4 rounded-xl font-bold text-center bg-green-500/20 text-green-400 border border-green-500/30">
        You're Registered!
      </div>
    );
  }

  return (
    <MagneticButton>
      <button 
        onClick={handleRegister}
        disabled={isPast || isFull || loading}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-center transition-colors ${
          isPast ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
          isFull ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
          'bg-white text-navy-900 hover:bg-electric-blue disabled:opacity-50'
        }`}
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {isPast ? 'Event Ended' : isFull ? 'Registration Full' : loading ? 'Registering...' : 'Register Now'}
      </button>
    </MagneticButton>
  );
}
