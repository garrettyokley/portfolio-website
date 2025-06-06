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
    <nav className="bg-black text-[#00ffff] sticky top-0 z-50" ref={dropdownRef}>
      {/* Header with name centered */}
      <div className="text-center py-4">
        <Link href="/" className="text-2xl font-bold hover:text-cyan-300 transition-colors">
          Garrett Yokley
        </Link>
      </div>
      
      {/* Navigation buttons block */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center items-center space-x-12">
          {/* Resume Button */}
          <Link href="/Garrett Yokley.pdf" target="_blank" className="border border-[#00ffff] px-4 py-2 rounded hover:bg-[#00ffff] hover:text-black transition-colors">
            Resume
          </Link>

          {/* Certifications Dropdown */}
          <div className="relative">
            <button onClick={() => { setCertsOpen(!certsOpen); setProjectsOpen(false); setLinksOpen(false); }} className="border border-[#00ffff] px-4 py-2 rounded hover:bg-[#00ffff] hover:text-black transition-colors">
              Certifications
            </button>
            {certsOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <Link href="/Security%2B%2C%20CompTIA.pdf" target="_blank" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Security+</Link>
                <Link href="/linux-plus-comptia" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Linux+</Link>
                <Link href="/linux-essentials-lpi" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Linux Essentials</Link>
                <Link href="/ITIL4, Information Technology Infrastructure Library.pdf" target="_blank" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">ITIL4</Link>
                <Link href="/ccna-cisco" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">CCNA</Link>
                <Link href="/rhcsa-red-hat" onClick={() => setCertsOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">RHCSA</Link>
              </div>
            )}
          </div>

          {/* Projects Dropdown */}
          {/* <div className="relative">
            <button onClick={() => { setProjectsOpen(!projectsOpen); setCertsOpen(false); setLinksOpen(false); }} className="border border-[#00ffff] px-4 py-2 rounded hover:bg-[#00ffff] hover:text-black transition-colors">
              Projects
            </button>
            {projectsOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <a href="https://github.com/garrettyokley" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Chess</a>
              </div>
            )}
          </div> */}

          {/* Education Button */}
          <Link href="/bachelor-computer-science-wgu" className="border border-[#00ffff] px-4 py-2 rounded hover:bg-[#00ffff] hover:text-black transition-colors">
            Education
          </Link>

          {/* Links Dropdown */}
          <div className="relative">
            <button onClick={() => { setLinksOpen(!linksOpen); setProjectsOpen(false); setCertsOpen(false); }} className="border border-[#00ffff] px-4 py-2 rounded hover:bg-[#00ffff] hover:text-black transition-colors">
              Links
            </button>
            {linksOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black border border-[#00ffff] rounded-md py-1 z-50">
                <a href="https://github.com/garrettyokley" target="_blank" rel="noopener noreferrer" onClick={() => setLinksOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/garrettyokley" target="_blank" rel="noopener noreferrer" onClick={() => setLinksOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">LinkedIn</a>
                <a href="https://wgu.joinhandshake.com/profiles/mcdppf" target="_blank" rel="noopener noreferrer" onClick={() => setLinksOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Handshake</a>
                <a href="https://tinyurl.com/emailgarrettyokley" target="_blank" rel="noopener noreferrer" onClick={() => setLinksOpen(false)} className="block px-4 py-2 text-sm text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors">Email</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 