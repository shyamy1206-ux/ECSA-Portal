import { createClient } from "@/lib/supabase/server";
import { StatusUpdater } from "@/components/admin/StatusUpdater";

export default async function AdminIdeaHubPage() {
  const supabase = createClient();
  
  // Fetch pending/under review ideas
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Idea Hub Moderation</h1>
          <p className="text-gray-400">Review, approve, and manage anonymous student submissions.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-electric-blue text-white">
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas && ideas.length > 0 ? (
          ideas.map((idea) => (
            <div key={idea.id} className="glass p-6 rounded-2xl flex flex-col group border border-white/5 hover:border-electric-cyan/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <StatusUpdater 
                  id={idea.id} 
                  table="ideas" 
                  currentStatus={idea.status} 
                  options={[
                    { label: 'Submitted', value: 'submitted' },
                    { label: 'Under Review', value: 'under_review' },
                    { label: 'Accepted', value: 'accepted' },
                    { label: 'Declined', value: 'declined' }
                  ]}
                />
                <span className="text-xs text-gray-500">
                  {new Date(idea.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-300 flex-1 mb-6 text-sm leading-relaxed">
                &quot;{idea.content}&quot;
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <div className="text-xs text-gray-400">
                  By {idea.is_anonymous ? 'Anonymous Student' : (idea.profiles?.full_name || 'Unknown')}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 glass rounded-2xl">
            <p>No ideas submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
