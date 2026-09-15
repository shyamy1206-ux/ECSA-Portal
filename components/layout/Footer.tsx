import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-navy-900 border-t border-white/10 mt-auto py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-xl font-heading font-bold flex items-center gap-2 mb-4">
            <span className="text-electric-blue">ECSA</span>
            <span className="text-gray-500 font-normal">| NMIET</span>
          </Link>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
            Electronics & Computer Students Association of PCET’s Nutan Maharashtra Institute of Engineering & Technology. Create | Connect | Build.
          </p>
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ECSA NMIET. All rights reserved.
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-electric-cyan transition-colors">About Us</Link></li>
            <li><Link href="/ecsa-bod" className="hover:text-electric-cyan transition-colors">Board of Directors</Link></li>
            <li><Link href="/clubs" className="hover:text-electric-cyan transition-colors">Clubs</Link></li>
            <li><Link href="/events" className="hover:text-electric-cyan transition-colors">Events</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/projects" className="hover:text-electric-cyan transition-colors">Projects</Link></li>
            <li><Link href="/resources" className="hover:text-electric-cyan transition-colors">Resource Vault</Link></li>
            <li><Link href="/contact" className="hover:text-electric-cyan transition-colors">Contact</Link></li>
            <li><Link href="/logo" className="hover:text-electric-cyan transition-colors">Brand & Logo</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
