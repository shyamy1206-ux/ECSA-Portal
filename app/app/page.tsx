import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-heading font-bold mb-2">Welcome to your ECSA Passport</h1>
        <p className="text-gray-400">Manage your campus activities, projects, and clubs.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">My Clubs</h3>
          <p className="text-gray-400 text-sm">You haven't joined any clubs yet.</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
          <p className="text-gray-400 text-sm">No registered events.</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Certificates</h3>
          <p className="text-gray-400 text-sm">0 verified certificates.</p>
        </div>
      </div>
    </div>
  );
}
