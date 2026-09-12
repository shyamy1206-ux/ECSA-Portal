"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

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

  // Don't show public navbar in app or admin routes
  if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
    return null;
  }

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "BOD", href: "/bod" },
    { name: "Clubs", href: "/clubs" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Ideas", href: "/ideas" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-heading font-bold flex items-center gap-2">
          <span className="text-electric-blue">ECSA</span>
          <span className="text-gray-500 font-light hidden sm:inline">| NMIET</span>
        </Link>

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

        <div className="flex items-center gap-4">
          <MagneticButton>
            <Link href="/login" className="px-5 py-2 text-sm font-semibold border border-white/20 rounded-full hover:bg-white/10 transition-colors">
              Login
            </Link>
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}
