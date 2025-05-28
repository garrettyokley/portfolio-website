'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [certsOpen, setCertsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectsOpen(false);
        setCertsOpen(false);
        setLinksOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    return (
    <nav className="bg-black text-[#00ffff] p-4 sticky top-0 z-50 border-b border-[#00ffff]" ref={dropdownRef}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-cyan-300 transition-colors">
          Garrett Yokley
        </Link>
        <div className="space-x-4 flex items-center">
          {/* Resume Button */}
          <Link href="/Garrett Yokley.pdf" target="_blank" className="hover:text-cyan-300 transition-colors">
            Resume
          </Link>

          {/* Certifications Dropdown */}
          <div className="relative">
            <button onClick={() => { setCertsOpen(!certsOpen); setProjectsOpen(false); setLinksOpen(false); }} className="hover:text-cyan-300 transition-colors">
              Certifications
            </button>
            {certsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <Link href="/Security+, CompTIA.pdf" target="_blank" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Security+</Link>
                <Link href="/Linux+, CompTIA.pdf" target="_blank" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Linux+</Link>
                <Link href="/Linux Essentials (LPI-1), Linux Professional Institute.pdf" target="_blank" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Linux Essentials</Link>
                <Link href="/ITIL4, Information Technology Infrastructure Library.pdf" target="_blank" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">ITIL4</Link>
                <Link href="/CCNA, Cisco.pdf" target="_blank" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">CCNA</Link>
              </div>
            )}
          </div>

          {/* Projects Dropdown */}
          <div className="relative">
            <button onClick={() => { setProjectsOpen(!projectsOpen); setCertsOpen(false); setLinksOpen(false); }} className="hover:text-cyan-300 transition-colors">
              Projects
            </button>
            {projectsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <a href="https://github.com/garrettyokley" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Chess</a>
              </div>
            )}
          </div>

          {/* Links Dropdown */}
          <div className="relative">
            <button onClick={() => { setLinksOpen(!linksOpen); setProjectsOpen(false); setCertsOpen(false); }} className="hover:text-cyan-300 transition-colors">
              Links
            </button>
            {linksOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <a href="https://github.com/garrettyokley" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/garrettyokley" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">LinkedIn</a>
                <a href="https://wgu.joinhandshake.com/profiles/mcdppf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Handshake</a>
                <a href="https://tinyurl.com/emailgarrettyokley" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Email</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 