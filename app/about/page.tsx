import MagneticButton from "@/components/ui/MagneticButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto flex flex-col relative z-10 pb-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">About ECSA</h1>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
          The <span className="text-electric-cyan font-semibold">Electronics & Computer Students Association (ECSA)</span> is the premier departmental organization at PCET’s Nutan Maharashtra Institute of Engineering & Technology (NMIET). 
          We are dedicated to fostering innovation, technical excellence, and community among students in the EST-2026-27 academic session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* HoD Profile */}
        <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-electric-blue/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-electric-blue/20 transition-colors"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center justify-center text-2xl font-bold text-gray-600">
            DK
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Dr. Dhanashree Kulkarni</h2>
          <p className="text-electric-blue text-sm font-bold uppercase tracking-wider mb-6">Head of Department</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Leading the department with a vision to create industry-ready engineers through practical learning, research, and technical communities. Under her guidance, ECSA bridges the gap between academics and cutting-edge technology.
          </p>
        </div>

        {/* Faculty Coordinator Profile */}
        <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-electric-magenta/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-magenta/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-electric-magenta/20 transition-colors"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center justify-center text-2xl font-bold text-gray-600">
            PP
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-1">Dr. Priyanka Patil</h2>
          <p className="text-electric-magenta text-sm font-bold uppercase tracking-wider mb-6">Faculty Coordinator</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The guiding force behind ECSA's student initiatives. She mentors the Board of Directors, oversees club activities, and ensures that student projects and events align with the department's standard of excellence.
          </p>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div>
          <h3 className="text-2xl font-heading font-bold mb-2">Join the Community</h3>
          <p className="text-gray-400">Be a part of our clubs, participate in hackathons, and build the future.</p>
        </div>
        <MagneticButton>
          <a href="/login" className="px-8 py-4 bg-white text-navy-900 font-bold rounded-full hover:bg-gray-200 transition-colors inline-block whitespace-nowrap">
            Get ECSA Passport
          </a>
        </MagneticButton>
      </div>
    </div>
  );
}
