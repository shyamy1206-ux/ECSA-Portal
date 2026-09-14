import { createClient } from "@/lib/supabase/server";

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
                <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider
                  ${idea.status === 'submitted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                  ${idea.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                  ${idea.status === 'declined' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                  ${idea.status === 'under_review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                `}>
                  {idea.status.replace('_', ' ')}
                </span>
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
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors" title="Accept">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                  <button className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors" title="Decline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
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
