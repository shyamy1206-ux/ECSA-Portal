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
  Megaphone,
  Image as ImageIcon,
  Briefcase,
  UserCheck,
  FolderGit2,
  HelpCircle,
  ScrollText,
  Ticket,
  Package
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import NotificationBell from "@/components/ui/NotificationBell";

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

  // Verify Admin Role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['ecsa_admin', 'super_admin'])
    .limit(1)
    .maybeSingle();

  if (!roleData) {
    redirect('/app');
  }

  const roleDisplay = roleData.role;

  return (
    <div className="min-h-screen flex bg-navy-900/80 pt-20">
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col fixed h-[calc(100vh-80px)] z-20">
        <div className="p-4 border-b border-white/10 flex items-center justify-center">
          <span className="text-xs text-electric-cyan px-3 py-1 rounded bg-electric-blue/10 border border-electric-blue/20 font-bold uppercase tracking-wider">
            Admin Workspace
          </span>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
          
          <div className="mt-4 mb-1 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Campus</div>
          <NavItem href="/admin/bod" icon={<Users size={18} />} label="Board of Directors" />
          <NavItem href="/admin/clubs" icon={<Users size={18} />} label="Clubs" />
          <NavItem href="/admin/recruitment" icon={<UserCheck size={18} />} label="Recruitment" />
          <NavItem href="/admin/events" icon={<FolderKanban size={18} />} label="Events" />
          <NavItem href="/admin/galleries" icon={<ImageIcon size={18} />} label="Galleries" />
          <NavItem href="/admin/projects" icon={<FolderGit2 size={18} />} label="Projects" />
          <NavItem href="/admin/opportunities" icon={<Briefcase size={18} />} label="Opportunities" />
          <NavItem href="/admin/certificates" icon={<Award size={18} />} label="Certificates" />
          <NavItem href="/admin/announcements" icon={<Megaphone size={18} />} label="Announcements" />
          <NavItem href="/admin/ideas" icon={<Lightbulb size={18} />} label="Ideas" />
          
          <div className="mt-4 mb-1 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Services</div>
          <NavItem href="/admin/helpdesk" icon={<HelpCircle size={18} />} label="Helpdesk" />
          <NavItem href="/admin/lost-and-found" icon={<Package size={18} />} label="Lost & Found" />
          <NavItem href="/admin/passport" icon={<Ticket size={18} />} label="Passport Scanner" />
          
          <div className="mt-4 mb-1 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">System</div>
          <NavItem href="/admin/users" icon={<Users size={18} />} label="Users & Roles" />
          <NavItem href="/admin/audit-logs" icon={<ScrollText size={18} />} label="Audit Logs" />
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-10 h-10 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan border border-electric-cyan/30">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium text-white truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-electric-blue uppercase tracking-wider">{roleDisplay.replace('_', ' ')}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <input 
              type="search" 
              aria-label="Search dashboard"
              placeholder="Search students, clubs, or certificates..." 
              className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-electric-blue focus-visible:ring-2 focus-visible:ring-electric-blue text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <NotificationBell />
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
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
    >
      <span className="text-gray-400 group-hover:text-electric-cyan transition-colors" aria-hidden="true">{icon}</span>
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
