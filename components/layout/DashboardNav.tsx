"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, User, FolderGit2, LifeBuoy, GraduationCap, Inbox } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import NotificationBell from "@/components/ui/NotificationBell";

export function DashboardNav({ 
  email, 
  isAdmin,
  bodName,
  bodPost
}: { 
  email?: string;
  isAdmin?: boolean;
  bodName?: string;
  bodPost?: string;
}) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/app", icon: User },
    { name: "My Projects", href: "/app/projects", icon: FolderGit2 },
    { name: "Mentorship", href: "/app/mentorship", icon: GraduationCap },
    { name: "Inbox", href: "/app/inbox", icon: Inbox },
    { name: "Campus Services", href: "/app/services", icon: LifeBuoy },
  ];

  if (isAdmin) {
    links.push({ name: "Admin Center", href: "/admin", icon: Shield });
  }

  // Determine display name
  const displayName = bodName || "Welcome back";
  const displaySubtext = bodPost || email;

  return (
    <div className="w-full bg-navy-900/60 backdrop-blur-xl border-b border-white/10 mb-8 pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* User Info & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-cyan text-xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-white font-bold text-xl">{displayName}</h1>
                {bodName && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                    BOD Member
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-0.5">{displaySubtext}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>

        {/* Horizontal Navigation */}
        <nav className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/app" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-electric-blue text-navy-900'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
