import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, User, FolderGit2, LifeBuoy, GraduationCap, Inbox } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import NotificationBell from "@/components/ui/NotificationBell";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

export default async function StudentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-navy-900/80 flex flex-col md:flex-row pt-20">
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 shrink-0 border-r border-white/10 p-6 flex flex-col gap-6 relative z-10 bg-navy-900/90 backdrop-blur-xl">
        <div className="mb-4">
          <Link href="/" className="text-xl font-heading font-bold flex items-center gap-2 mb-2">
            <span className="text-electric-blue">ECSA</span>
            <span className="text-gray-500 font-light hidden sm:inline">| NMIET</span>
          </Link>
          <p className="text-xs text-electric-cyan font-mono mt-1 mb-6">Passport ID: {session.user.id.substring(0,8).toUpperCase()}</p>
          <GlobalSearch />
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/app" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <User size={18} aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
          <Link href="/app/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <FolderGit2 size={18} aria-hidden="true" />
            <span>My Projects</span>
          </Link>
          <Link href="/app/mentorship" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <GraduationCap size={18} aria-hidden="true" />
            <span>Mentorship</span>
          </Link>
          <Link href="/app/inbox" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <Inbox size={18} aria-hidden="true" />
            <span>Inbox</span>
          </Link>
          <Link href="/app/services" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <LifeBuoy size={18} aria-hidden="true" />
            <span>Campus Services</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue">
            <Shield size={18} aria-hidden="true" />
            <span>Admin Center</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-cyan">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              {user.email}
            </div>
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
