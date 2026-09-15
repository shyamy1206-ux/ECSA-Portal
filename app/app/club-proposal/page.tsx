import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function ClubProposalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function submitProposal(formData: FormData) {
    "use server";
    
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const department = formData.get("department") as string;
    
    // Generate a basic slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { error } = await supabaseServer
      .from('clubs')
      .insert({
        name,
        description,
        department,
        slug,
        status: 'pending',
        created_by: user.id
      });

    if (!error) {
      revalidatePath('/app/club-proposal');
      redirect('/app?message=Proposal Submitted Successfully!');
    } else {
      console.error(error);
      redirect(`/app/club-proposal?error=${error.message}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="glass p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-heading font-bold mb-2">Submit a Club Proposal</h1>
        <p className="text-gray-400 mb-8">Got an idea for a new club? Submit the details below for the ECSA Board to review.</p>

        <form action={submitProposal} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Club Name</label>
            <input 
              type="text" 
              name="name" 
              required
              className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
              placeholder="e.g. AI & Robotics Club"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <input 
              type="text" 
              name="department" 
              required
              className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue transition-colors"
              placeholder="e.g. Computer Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Purpose & Description</label>
            <textarea 
              name="description" 
              required
              rows={5}
              className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue transition-colors"
              placeholder="What is the goal of this club? What activities will you organize?"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <a href="/clubs" className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</a>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-electric-blue hover:bg-electric-cyan text-navy-900 text-sm font-bold rounded-lg transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
