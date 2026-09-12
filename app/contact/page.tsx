import { Mail, MapPin } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto pb-20">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Get in Touch</h1>
        <p className="text-gray-400 text-lg">
          Have questions about events, clubs, or ECSA initiatives? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10 flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Visit Us</h3>
              <p className="text-gray-400 leading-relaxed">
                ECSA Office, Dept of E&TC and Computer Engineering,<br/>
                Nutan Maharashtra Institute of Engineering & Technology (NMIET)<br/>
                Talegaon Dabhade, Pune.
              </p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-electric-cyan/10 flex items-center justify-center text-electric-cyan shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Email Us</h3>
              <p className="text-gray-400 mb-1">General: info@nmiet.edu.in</p>
              <p className="text-gray-400">ECSA Support: ecsa@nmiet.edu.in</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass p-8 md:p-10 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Your Name</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <input type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Subject</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Message</label>
              <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none" placeholder="Your message here..."></textarea>
            </div>
            <MagneticButton>
              <button type="button" className="w-full py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-electric-blue transition-colors">
                Send Message
              </button>
            </MagneticButton>
          </form>
        </div>
      </div>
    </div>
  );
}
