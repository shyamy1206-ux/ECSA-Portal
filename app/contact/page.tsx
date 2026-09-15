import { Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

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
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
