import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BODAdminClient, { BODMemberAdmin } from "./BODAdminClient";

export default async function ManageBODPage() {
  const supabase = createClient();
  
  // Verify Admin Access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let members: BODMemberAdmin[] = [];
  try {
    const { data } = await supabase
      .from('bod_members')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (data) members = data as BODMemberAdmin[];
  } catch (err) {
    // Suppress error for preview
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Manage Board of Directors</h1>
          <p className="text-gray-400">Add, edit, or reorder members and upload profile photos.</p>
        </div>
      </div>
      
      <BODAdminClient initialMembers={members} />
    </div>
  );
}
