import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Lightbulb, 
  Award,
  Settings,
  LogOut,
  Bell
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify Admin Role (fallback to protecting the UI if not 'ecsa_admin' or 'super_admin')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ecsa_admin' && profile?.role !== 'super_admin') {
    // If not an admin, send them back to the student portal
    redirect('/app');
  }

  return (
    <div className="min-h-screen flex bg-navy-900/80">
      {/* Frosted Glass Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col fixed h-screen z-20">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-heading font-bold text-electric-blue flex items-center gap-2">
            <ShieldIcon /> ECSA Admin
          </Link>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
          <NavItem href="/admin/clubs" icon={<Users size={18} />} label="Club Onboarding" />
          <NavItem href="/admin/content" icon={<FolderKanban size={18} />} label="Content Moderation" />
          <NavItem href="/admin/ideas" icon={<Lightbulb size={18} />} label="Idea Hub" />
          <NavItem href="/admin/certificates" icon={<Award size={18} />} label="Certificates" />
          <div className="mt-8 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-10 h-10 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan border border-electric-cyan/30">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="font-semibold text-white truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-electric-blue uppercase tracking-wider">{profile.role.replace('_', ' ')}</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <input 
              type="text" 
              placeholder="Search students, clubs, or certificates..." 
              className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-electric-blue text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-electric-magenta rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white group"
    >
      <span className="text-gray-400 group-hover:text-electric-cyan transition-colors">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-blue">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  )
}
