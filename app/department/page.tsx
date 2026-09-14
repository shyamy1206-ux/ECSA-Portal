import { BookOpen, Cpu, Globe, Users } from "lucide-react";

export default function DepartmentPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">The Department</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Electronics & Computer Engineering at NMIET bridging the gap between core hardware and modern software architectures.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass p-8 rounded-3xl border border-white/10 hover:border-electric-blue/30 transition-colors">
          <Cpu className="text-electric-blue mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-3">Hardware & Embedded</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Deep dive into microcontrollers, IoT, VLSI, and digital system design. Our state-of-the-art labs provide hands-on experience with modern embedded systems and hardware architecture.
          </p>
        </div>
        
        <div className="glass p-8 rounded-3xl border border-white/10 hover:border-electric-cyan/30 transition-colors">
          <Globe className="text-electric-cyan mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-3">Software & Systems</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Master the complete software lifecycle, from algorithms and data structures to cloud computing, artificial intelligence, and full-stack web development.
          </p>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-6">Vision & Mission</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-electric-blue mb-2 flex items-center gap-2">
              <BookOpen size={18} /> Our Vision
            </h3>
            <p className="text-gray-400">
              To be recognized as a center of excellence in Electronics and Computer Engineering education, producing globally competent engineers who are technically sound, socially responsible, and capable of solving complex challenges.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-electric-cyan mb-2 flex items-center gap-2">
              <Users size={18} /> Our Mission
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>To impart high-quality education aligning with current industry trends.</li>
              <li>To foster a culture of research, innovation, and continuous learning.</li>
              <li>To develop leadership qualities and professional ethics through practical exposure.</li>
              <li>To strengthen industry-institute interaction for bridging the skill gap.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


