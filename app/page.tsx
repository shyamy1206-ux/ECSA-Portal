import MagneticButton from "@/components/ui/MagneticButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 tracking-tighter">
        Electronics & Computer <br />
        <span className="text-electric-blue">Students Association</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl font-light">
        PCET’s Nutan Maharashtra Institute of Engineering & Technology
      </p>
      
      <div className="flex gap-6 items-center text-sm uppercase tracking-widest text-electric-cyan font-bold mb-12">
        <span>Create</span>
        <span className="w-2 h-2 rounded-full bg-electric-violet"></span>
        <span>Connect</span>
        <span className="w-2 h-2 rounded-full bg-electric-violet"></span>
        <span>Build</span>
      </div>

      <div className="flex gap-4">
        <MagneticButton>
          <a href="/clubs" className="px-8 py-4 glass rounded-full hover:bg-white/10 transition-colors inline-block">
            Explore Clubs
          </a>
        </MagneticButton>
        <MagneticButton>
          <a href="/login" className="px-8 py-4 bg-electric-blue text-navy-900 font-semibold rounded-full hover:bg-electric-cyan transition-colors inline-block">
            Join ECSA
          </a>
        </MagneticButton>
      </div>
    </div>
  );
}
