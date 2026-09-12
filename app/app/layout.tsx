import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Shield, LogOut } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/app" className="text-xl font-heading font-bold text-electric-blue">
            ECSA Portal
          </Link>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2">
          <Link href="/app" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white">
            <User size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-electric-blue text-gray-300 hover:text-white">
            <Shield size={18} />
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
            <button className="hover:text-white">
              <LogOut size={16} />
            </button>
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
