import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Inbox as InboxIcon, CheckCircle, Bell, Megaphone, Calendar, Briefcase, Info } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { format } from "date-fns";
import { markAllAsRead, deleteNotification } from "./actions";

export default async function InboxPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Megaphone className="text-electric-blue" size={20} />;
      case 'event': return <Calendar className="text-electric-cyan" size={20} />;
      case 'opportunity': return <Briefcase className="text-electric-magenta" size={20} />;
      default: return <Info className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <InboxIcon size={28} className="text-electric-cyan" />
            Inbox
            {unreadCount > 0 && (
              <span className="bg-electric-cyan text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-400">All your campus notifications in one place.</p>
        </div>
        
        {unreadCount > 0 && (
          <form action={markAllAsRead}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
              <CheckCircle size={16} /> Mark all as read
            </button>
          </form>
        )}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {notifications && notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {notifications.map((notif: any) => (
              <div key={notif.id} className={`p-6 flex gap-4 transition-colors relative group ${notif.is_read ? 'opacity-70 bg-transparent' : 'bg-white/5'}`}>
                {!notif.is_read && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-electric-cyan rounded-r-full shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
                )}
                
                <div className="mt-1 shrink-0">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-1">
                    <h3 className={`font-bold text-lg ${notif.is_read ? 'text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(notif.created_at), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-3">{notif.message}</p>
                  
                  <div className="flex items-center justify-between">
                    {notif.link ? (
                      <Link href={notif.link} className="text-sm font-semibold text-electric-blue hover:text-electric-cyan transition-colors">
                        View details &rarr;
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    
                    <form action={deleteNotification.bind(null, notif.id)}>
                      <button type="submit" className="text-xs text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12">
            <EmptyState 
              title="You're all caught up!" 
              description="You don't have any notifications right now."
              icon={<Bell size={40} className="text-gray-600" />}
              className="border-none bg-transparent shadow-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
