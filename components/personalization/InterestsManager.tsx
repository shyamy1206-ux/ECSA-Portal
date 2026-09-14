"use client";

import { useState } from "react";
import { updateInterests } from "@/app/app/actions";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, Check } from "lucide-react";

const AVAILABLE_INTERESTS = [
  "AI & Machine Learning",
  "Web Development",
  "Robotics",
  "Cybersecurity",
  "IoT & Hardware",
  "Cloud Computing",
  "App Development",
  "UI/UX Design",
  "Data Science",
  "Game Dev",
  "Blockchain",
  "Competitive Programming"
];

export function InterestsManager({ initialInterests = [] }: { initialInterests?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialInterests);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Only show as onboarding if they have 0 interests
  const [isOnboarding, setIsOnboarding] = useState(initialInterests.length === 0);

  const toggleInterest = (interest: string) => {
    setSelected(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      toast("Please select at least one interest.", "error");
      return;
    }
    
    setLoading(true);
    try {
      const res = await updateInterests(selected);
      if (res.error) {
        toast(res.error, "error");
      } else {
        toast("Interests updated!", "success");
        setIsOnboarding(false);
      }
    } catch (err) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOnboarding) return null;

  return (
    <div className="glass p-8 rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/5 to-transparent mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Personalize Your Experience</h2>
          <p className="text-sm text-gray-400">Select your interests to discover relevant clubs, events, and opportunities.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 mt-6">
        {AVAILABLE_INTERESTS.map(interest => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isSelected 
                  ? 'bg-electric-cyan text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : 'bg-black/40 text-gray-400 border border-white/10 hover:border-white/30'
              }`}
            >
              {isSelected && <Check size={14} />}
              {interest}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading || selected.length === 0}
          className="px-6 py-2.5 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
