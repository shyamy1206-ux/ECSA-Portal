"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NotificationBell() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  // Get current user id and initial notifications
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        
        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (notifs) {
          setNotifications(notifs);
          setHasUnread(notifs.some(n => !n.is_read));
        }
      }
    };
    init();
  }, [supabase]);

  // Use the realtime hook
  useRealtime(
    'notifications',
    (payload) => {
      if (payload.eventType === 'INSERT') {
        const newNotif = payload.new;
        setHasUnread(true);
        setNotifications(prev => [newNotif, ...prev].slice(0, 5));
        toast(newNotif.message || newNotif.title || 'New Notification', 'info');
      }
    },
    `user_id=eq.${userId}`,
    !!userId // Only enable subscription if we have a valid userId
  );

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasUnread && userId) {
      // Mark as read when opened
      setHasUnread(false);
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative p-2 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan rounded-md"
      >
        <Bell size={20} aria-hidden="true" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-electric-cyan rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" aria-label="Unread notifications"></span>
        )}
      </button>

      {isOpen && (
        <div role="menu" aria-label="Notifications Menu" className="absolute bottom-full mb-2 right-0 w-80 max-h-96 overflow-y-auto glass border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md">
            <h3 className="font-bold text-white">Notifications</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-white/5 transition-colors ${notif.is_read ? 'opacity-75' : 'bg-white/5'}`}>
                  <h4 className="text-sm font-bold text-white mb-1">{notif.title}</h4>
                  <p className="text-xs text-gray-400">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/10 bg-black/80 backdrop-blur-md text-center">
            <Link href="/app/inbox" onClick={() => setIsOpen(false)} className="text-xs font-bold text-electric-blue hover:text-electric-cyan transition-colors uppercase tracking-wider">
              View All in Inbox &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
