import { createClient } from "@/lib/supabase/server";
import IdeaSubmissionForm from "./IdeaSubmissionForm";
import { revalidatePath } from "next/cache";

export default async function IdeaHubPage() {
  const supabase = createClient();
  
  // Fetch approved ideas
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .in('status', ['accepted', 'in_progress', 'completed'])
    .order('created_at', { ascending: false });

  // Handle server action for submission
  async function submitIdea(formData: FormData) {
    "use server";
    const supabaseServer = createClient();
    
    const content = formData.get('content') as string;
    const is_anonymous = formData.get('is_anonymous') === 'on';
    
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (content) {
      await supabaseServer.from('ideas').insert({
        content,
        is_anonymous,
        author_id: user?.id || null, // Allow null if completely public, but our RLS might require auth
      });
      revalidatePath('/ideas');
      revalidatePath('/admin/ideas');
    }
  }

  return (
    <div className="min-h-screen pt-24 px-8 max-w-6xl mx-auto flex flex-col relative z-10 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Student Idea Hub</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Have an idea for a hackathon, workshop, or campus improvement? Submit it anonymously below. The ECSA board reviews every submission.
        </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submission Form */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl border border-white/10 sticky top-28">
            <h3 className="text-xl font-bold mb-4">Submit an Idea</h3>
            <IdeaSubmissionForm submitIdea={submitIdea} />
          </div>
        </div>

        {/* Public Ideas List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-4">Approved & Trending Ideas</h3>
          {ideas && ideas.length > 0 ? (
            ideas.map((idea) => (
              <div key={idea.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full border bg-electric-cyan/10 text-electric-cyan border-electric-cyan/20 uppercase tracking-wider font-semibold">
                    {idea.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{idea.content}</p>
                <div className="text-xs text-gray-500">
                  Submitted by: {idea.is_anonymous ? 'Anonymous Student' : 'Student'}
                </div>
              </div>
            ))
          ) : (
            <div className="glass p-12 text-center rounded-2xl border border-white/5 text-gray-500">
              No public ideas yet. Be the first to submit!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

