"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan rounded-sm p-1 -m-1" 
      title="Log out"
      aria-label="Log out"
    >
      <LogOut size={16} aria-hidden="true" />
    </button>
  );
}
