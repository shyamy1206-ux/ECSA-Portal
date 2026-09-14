import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function StudentMentorshipPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // Fetch mentorship requests from this student
  const { data: requests } = await supabase
    .from('mentorship_requests')
    .select(`
      *,
      mentorship_profiles(
        job_title, company, graduation_year,
        profiles(full_name)
      )
    `)
    .eq('student_id', session.user.id)
    .order('created_at', { ascending: false });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} className="text-green-400" />;
      case 'declined': return <XCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-yellow-400" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400';
      case 'declined': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">My Mentorship</h1>
          <p className="text-gray-400">Track your mentorship requests and connections.</p>
        </div>
        <Link
          href="/mentorship"
          className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors"
        >
          Find Mentors
        </Link>
      </div>

      {requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req: any) => {
            const mentor = req.mentorship_profiles;
            return (
              <div key={req.id} className="glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                      {mentor?.profiles?.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{mentor?.profiles?.full_name || 'Unknown Mentor'}</h3>
                      <p className="text-sm text-gray-400">{mentor?.job_title} at {mentor?.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(req.status)}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${statusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 bg-black/20 rounded-lg p-3 border border-white/5">
                  {req.message}
                </p>

                {req.topics && req.topics.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {req.topics.map((topic: string) => (
                      <span key={topic} className="px-2 py-1 rounded bg-electric-blue/10 text-electric-cyan text-xs">{topic}</span>
                    ))}
                  </div>
                )}

                {req.mentor_notes && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-sm text-green-300">
                    <p className="text-xs text-green-500 font-bold mb-1">Mentor&apos;s Note:</p>
                    {req.mentor_notes}
                  </div>
                )}

                <p className="text-xs text-gray-600 mt-4">Sent {new Date(req.created_at).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Mentorship Requests"
          description="Browse the alumni mentorship network and send your first request."
          icon={<MessageSquare size={40} />}
        />
      )}
    </div>
  );
}
