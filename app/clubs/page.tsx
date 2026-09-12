import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";

const CLUBS = [
  { slug: "ecsa", name: "ECSA", fullName: "Electronics & Computer Students Association", dept: "Electronics & Computer Engineering" }
];

export default function ClubsDirectory() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col relative z-10 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Departmental Clubs</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Discover the official student organizations at NMIET. Join a club to collaborate on projects, host events, and build your network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLUBS.map((club) => (
          <Link href={`/clubs/${club.slug}`} key={club.slug} className="group block">
            <div className="glass p-6 rounded-3xl border border-white/10 hover:border-electric-blue/50 transition-all hover:-translate-y-1 h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center justify-center text-xl font-heading font-bold text-gray-500 group-hover:text-electric-cyan transition-colors">
                {club.name.substring(0, 2)}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-electric-blue transition-colors">{club.name}</h2>
              <h3 className="text-sm font-medium text-gray-300 mb-4 h-10">{club.fullName}</h3>
              
              <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{club.dept}</span>
                <span className="text-electric-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Register New Club Card */}
        <div className="glass p-6 rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center min-h-[250px] bg-black/20">
          <h3 className="text-lg font-bold text-gray-300 mb-2">Start a New Club</h3>
          <p className="text-sm text-gray-500 mb-6 px-4">
            Have an idea for a new departmental club? Submit a proposal to the ECSA Board.
          </p>
          <MagneticButton>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full transition-colors">
              Submit Proposal
            </button>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
