import MagneticButton from "@/components/ui/MagneticButton";
import CampusAnnouncements from "@/components/ui/CampusAnnouncements";
import TrendingSection from "@/components/ui/TrendingSection";
import BODList from "@/components/bod/BODList";

import { ScrollStorySection } from "@/components/scroll-story/ScrollStorySection";

export default function Home() {
  return (
    <main className="w-full flex flex-col relative z-10">
      
      {/* 1. HERO */}
      <ScrollStorySection id="hero" className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter mb-4 drop-shadow-2xl">
          ELECTRONICS & COMPUTER <br/><span className="text-electric-blue">ENGINEERING</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl font-normal">
          ENGINEERING THE INTELLIGENCE BEHIND TOMORROW.
        </p>
        <div className="flex gap-4 mt-8">
          <MagneticButton>
            <a href="/clubs" className="px-8 py-4 glass rounded-full hover:bg-white/10 transition-colors inline-block">
              Explore Clubs
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="/login" className="px-8 py-4 bg-electric-blue text-navy-900 font-medium rounded-full hover:bg-electric-cyan transition-colors inline-block">
              Join ECSA
            </a>
          </MagneticButton>
        </div>
      </ScrollStorySection>


      {/* 2. ABOUT */}
      <ScrollStorySection id="about" className="flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 tracking-[0.2em] uppercase text-electric-cyan">
          About the Department
        </h2>
        <p className="max-w-3xl text-lg text-gray-300 leading-relaxed text-center">
          The Department of Electronics and Computer Engineering at PCET&apos;s NMIET bridges the gap between hardware and software. We empower students to design integrated systems, advanced robotics, IoT devices, and artificial intelligence models.
        </p>
      </ScrollStorySection>

      {/* 3. ACADEMICS & LABS */}
      <ScrollStorySection id="academics" className="flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-12 tracking-widest text-white">
          STATE-OF-THE-ART <span className="text-electric-magenta">LABS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="glass p-8 rounded-2xl border border-white/10 hover:border-electric-magenta transition-colors">
            <h3 className="text-xl font-bold mb-4 text-electric-magenta">VLSI Design</h3>
            <p className="text-gray-400 text-sm">Design and simulate millions of transistors on a single microchip.</p>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/10 hover:border-electric-blue transition-colors">
            <h3 className="text-xl font-bold mb-4 text-electric-blue">Embedded Systems</h3>
            <p className="text-gray-400 text-sm">Program microcontrollers and develop real-time hardware applications.</p>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/10 hover:border-electric-cyan transition-colors">
            <h3 className="text-xl font-bold mb-4 text-electric-cyan">Machine Learning</h3>
            <p className="text-gray-400 text-sm">Train neural networks and optimize inference on edge devices.</p>
          </div>
        </div>
      </ScrollStorySection>

      {/* 4. PROJECTS */}
      <ScrollStorySection id="projects" className="flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-md border-t border-white/10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-12 tracking-widest text-white text-center">
          STUDENT <span className="text-electric-blue">INNOVATION</span>
        </h2>
        <TrendingSection />
      </ScrollStorySection>

      {/* 5. ECSA / EVENTS */}
      <ScrollStorySection id="ecsa" className="flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 tracking-widest text-white text-center">
          CAMPUS <span className="text-electric-cyan">LIFE</span>
        </h2>
        <div className="w-full max-w-7xl">
          <CampusAnnouncements />
        </div>
      </ScrollStorySection>

      {/* 5.5 ECSA BOD */}
      <ScrollStorySection id="bod" className="flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-12 tracking-widest text-white text-center">
          MEET THE <span className="text-electric-cyan">BOARD</span>
        </h2>
        <div className="w-full max-w-7xl">
          <BODList />
        </div>
      </ScrollStorySection>

      {/* 6. CONTACT */}
      <ScrollStorySection id="contact" className="flex flex-col items-center justify-center p-8 border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <h2 className="text-4xl font-heading font-bold mb-8 tracking-widest text-white text-center">
          CONNECT WITH US
        </h2>
        <p className="text-gray-400 text-center mb-8">Ready to build the future?</p>
        <a href="/contact" className="px-8 py-4 border border-white/20 rounded-full hover:bg-white text-white hover:text-black transition-all">
          Get in Touch
        </a>
      </ScrollStorySection>

    </main>
  );
}


