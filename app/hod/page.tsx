import { Mail, Phone } from "lucide-react";

export default function HoDPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-4xl mx-auto pb-20">
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Message from the Head of Department</h1>
        <div className="w-20 h-1 bg-electric-blue mb-12"></div>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Photo & Contact */}
          <div className="shrink-0 w-full md:w-64 flex flex-col items-center">
            <div className="w-48 h-48 md:w-full md:h-64 rounded-2xl bg-white/5 border border-white/10 mb-6 overflow-hidden relative">
              {/* Placeholder for real photo */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <span className="text-sm">Photo</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-1">Dr. Dhanashree Kulkarni</h2>
            <p className="text-electric-cyan text-sm mb-4 text-center">Head of Department (E&TC/COMP)</p>
            
            <div className="w-full space-y-3 text-sm text-gray-400">
              <a href="#" className="flex items-center gap-3 hover:text-electric-blue transition-colors">
                <Mail size={16} /> hod.etc@nmiet.edu.in
              </a>
              <div className="flex items-center gap-3">
                <Phone size={16} /> +91 (TBA)
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 space-y-6 text-gray-300 leading-relaxed">
            <p>
              Welcome to the Department of Electronics & Computer Engineering at PCET’s Nutan Maharashtra Institute of Engineering & Technology (NMIET).
            </p>
            <p>
              Our department is dedicated to providing a dynamic and rigorous academic environment that bridges the gap between hardware and software. Through the Electronics & Computer Students Association (ECSA), we empower our students to transform theoretical knowledge into practical, industry-ready skills.
            </p>
            <p>
              ECSA serves as the beating heart of our department&apos;s extracurricular activities. It is a platform for innovation, leadership, and technical excellence. We encourage all students to actively participate in ECSA&apos;s workshops, hackathons, and mentorship programs.
            </p>
            <p className="font-medium text-white italic">
              &quot;Create. Connect. Build. We don&apos;t just study technology; we shape the future of it.&quot;
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}


