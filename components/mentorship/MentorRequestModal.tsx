"use client";

import { useState } from "react";
import { requestMentorship } from "@/app/mentorship/actions";
import { useToast } from "@/components/ui/Toast";
import { X, Send } from "lucide-react";

interface MentorRequestModalProps {
  mentorId: string;
  mentorName: string;
  topics: string[];
  onClose: () => void;
}

export function MentorRequestModal({ mentorId, mentorName, topics, onClose }: MentorRequestModalProps) {
  const [message, setMessage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function toggleTopic(topic: string) {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestMentorship(mentorId, message, selectedTopics);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast("Mentorship request sent!", 'success');
        onClose();
      }
    } catch (err) {
      toast("An unexpected error occurred.", 'error');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg bg-[#0a0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Request Mentorship</h3>
            <p className="text-sm text-gray-400">Contacting {mentorName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {topics && topics.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">Topics of Interest</label>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedTopics.includes(topic)
                        ? 'bg-electric-blue text-navy-900'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              minLength={20}
              placeholder="Introduce yourself, explain what guidance you're looking for, and what you hope to achieve..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/20 minimum characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || message.length < 20}
            className="w-full flex items-center justify-center gap-2 py-3 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
