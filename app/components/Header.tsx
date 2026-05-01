"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Dock from './Dock';
import { VscOrganization, VscBriefcase, VscTag, VscMail } from 'react-icons/vsc';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        const whiteSection = document.getElementById('white-section');
        if (whiteSection) {
          setIsScrolled(whiteSection.getBoundingClientRect().top <= 85);
        } else {
          setIsScrolled(window.scrollY > 50);
        }
      } else {
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const isDarkText = !isHome || isMobileMenuOpen;

  const navLinks = [
    { name: 'Brands', path: '/brands' },
    { name: 'Projects', path: '/projects' },
    { name: 'About Us', path: '/about' },
    { name: 'Contacts', path: '/contacts' },
  ];

  const dockItems = [
    { icon: <VscTag size={22} />, label: 'Brands', onClick: () => router.push('/brands') },
    { icon: <VscBriefcase size={22} />, label: 'Projects', onClick: () => router.push('/projects') },
    { icon: <VscOrganization size={22} />, label: 'About Us', onClick: () => router.push('/about') },
    { icon: <VscMail size={22} />, label: 'Contacts', onClick: () => router.push('/contacts') },
  ];

  return (
    <>
      <header className={`${isHome ? 'fixed inset-x-0 top-0' : 'relative'} z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} bg-transparent`}>
        <div className="flex justify-between items-center py-6 md:py-8 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
          
          <Link href="/" className="flex items-center gap-3 relative z-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-[#D6B98C] w-8 h-8 md:w-9 md:h-9 rounded flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo-pja.png" alt="PJA Logo" className="w-full h-full object-contain" />
            </div>
            <div className={`font-extrabold text-xl md:text-2xl tracking-tight transition-colors duration-300 ${isDarkText ? 'text-neutral-800' : 'text-white'}`}>
              PJA<span className={`font-medium transition-colors duration-300 ${isDarkText ? 'text-neutral-500' : 'text-neutral-300'}`}>INDONESIA</span>
            </div>
          </Link>

          <nav className={`hidden md:flex items-center gap-10 font-bold text-xs transition-colors duration-300 ${isDarkText ? 'text-neutral-600' : 'text-neutral-300'}`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`transition-colors relative ${isActive ? 'text-[#DBB884] after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#DBB884]' : isDarkText ? 'hover:text-neutral-900' : 'hover:text-white'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <button
            className={`md:hidden relative z-50 ml-4 w-10 h-10 flex items-center justify-center focus:outline-none rounded-full backdrop-blur-sm transition-colors duration-300 ${isDarkText ? 'text-neutral-800 bg-black/5 hover:bg-black/10' : 'text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className={`absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </button>

          <div
            className={`fixed inset-0 bg-[#F9F9F9] z-40 flex flex-col pt-32 px-10 md:hidden transition-all duration-500 ease-out ${
              isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-8 pointer-events-none"
            }`}
          >
            <nav className="flex flex-col gap-8 text-[32px] font-black tracking-tighter text-neutral-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`transition-all duration-500 delay-[50ms] ${pathname === '/' ? 'text-[#DBB884]' : ''} ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>Home</Link>
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`transition-all duration-500 ${pathname === link.path ? 'text-[#DBB884]' : ''} ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${(index + 2) * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'}`}>
        <Dock 
          items={dockItems} 
          panelWidth={64} 
          baseItemSize={48} 
          magnification={64} 
          topContent={
            <div 
              className="group relative bg-[#D6B98C] w-12 h-12 rounded-xl flex items-center justify-center p-2 shadow-lg cursor-pointer transition-transform hover:scale-105" 
              onClick={() => {
                if (pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  router.push('/');
                }
              }}
            >
              <img src="/logo-pja.png" alt="PJA Logo" className="w-full h-full object-contain relative z-10" />
              
              <div className="absolute top-1/2 right-[calc(100%+1rem)] w-fit whitespace-pre rounded-lg border border-white/15 bg-[#120F17]/95 px-3 py-1 text-xs font-bold text-[#DBB884] uppercase tracking-wider opacity-0 -translate-y-1/2 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg pointer-events-none">
                Home
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
