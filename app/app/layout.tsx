import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "@/components/layout/DashboardNav";

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
  
  // Check if admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  const isAdmin = roleData?.role === 'super_admin' || roleData?.role === 'ecsa_admin';

  // Check if BOD member
  const { data: bodData } = await supabase
    .from('bod_members')
    .select('full_name, post')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-navy-900/80 flex flex-col">
      <DashboardNav 
        email={user.email} 
        isAdmin={isAdmin} 
        bodName={bodData?.full_name} 
        bodPost={bodData?.post} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 pb-20">
        {children}
      </main>
    </div>
  );
}
