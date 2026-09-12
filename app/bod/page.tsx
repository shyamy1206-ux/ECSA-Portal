import MagneticButton from "@/components/ui/MagneticButton";

const BOD_MEMBERS = [
  { role: "President", name: "Priyanshu Prasad" },
  { role: "Vice President", name: "Tanushree Jadhav" },
  { role: "Secretary", name: "Ojas Sulakhe" },
  { role: "Joint Secretary", name: "Vrushabh Yeole", highlight: true },
  { role: "Treasurer", name: "Aman Wagh" },
  { role: "PR & Outreach Head", name: "Tanay Borase" },
  { role: "Technical Head", name: "Shrujal Inde" },
  { role: "Event Management Head", name: "Vaibhav" },
  { role: "Social Media & Publicity Head", name: "Pranav Borkar" },
  { role: "Design & Creative Head", name: "Payal Jadhav" },
  { role: "Sponsorship & Industry Head", name: "Atharva Karanjekar" },
  { role: "Discipline & Coordination Head", name: "Dipali Thorbole" }
];

export default function BoardOfDirectorsPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col">
      <div className="mb-12 relative z-10 pointer-events-none text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Board of Directors</h1>
        <p className="text-gray-400 text-lg">
          Meet the dedicated team leading the Electronics & Computer Students Association for the EST-2026-27 academic session.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 pb-20">
        {BOD_MEMBERS.map((member, idx) => (
          <div 
            key={idx} 
            className={`glass p-6 rounded-2xl border flex flex-col items-center text-center group hover:-translate-y-1 transition-transform
              ${member.highlight ? 'border-electric-blue/50 bg-electric-blue/5' : 'border-white/10 hover:border-white/20'}`
            }
          >
            <div className="w-24 h-24 rounded-full bg-black/40 border border-white/10 mb-4 overflow-hidden relative">
              {/* Placeholder for Photo (Requested feature) */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-heading font-bold text-gray-700">
                {member.name.charAt(0)}
              </div>
            </div>
            
            <h3 className={`text-lg font-semibold mb-1 ${member.highlight ? 'text-white' : 'text-gray-200'}`}>
              {member.name}
            </h3>
            <p className={`text-xs font-bold uppercase tracking-wider ${member.highlight ? 'text-electric-cyan' : 'text-electric-blue'}`}>
              {member.role}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pb-12 relative z-10">
        <MagneticButton>
          <a href="/contact" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors inline-block border border-white/10">
            Contact the Board
          </a>
        </MagneticButton>
      </div>
    </div>
  );
}
