"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsLoggedIn(!!session);
      });
      
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setIsLoggedIn(!!session);
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    });
  }, []);

  // Navbar now shows everywhere, no longer hiding on /app or /admin

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "BOD", href: "/ecsa-bod" },
    { name: "Clubs", href: "/clubs" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Ideas", href: "/ideas" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-heading font-bold flex items-center gap-2">
          <span className="text-electric-blue">ECSA</span>
          <span className="text-gray-500 font-normal hidden sm:inline">| NMIET</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-electric-cyan ${pathname === link.href ? 'text-electric-blue' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <GlobalSearch />
          <MagneticButton>
            <Link href={isLoggedIn ? "/app" : "/login"} className="px-5 py-2 text-sm font-medium border border-white/20 rounded-full hover:bg-white/10 transition-colors">
              {isLoggedIn ? "Dashboard" : "Login"}
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 right-0 bg-navy-900/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center py-6 gap-6">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium transition-colors hover:text-electric-cyan ${pathname === link.href ? 'text-electric-blue' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href={isLoggedIn ? "/app" : "/login"} 
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-3 text-sm font-medium border border-electric-cyan text-electric-cyan rounded-full hover:bg-electric-cyan hover:text-navy-900 transition-colors"
          >
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </div>
      )}
    </nav>
  );
}
