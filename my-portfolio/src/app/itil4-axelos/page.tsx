'use client';

import React from 'react';
import Link from 'next/link';

export default function ITIL4Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-8 pt-12">
      <div className="max-w-4xl w-full bg-gray-900 border border-[#00ffff] rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00ffff] mb-4">ITIL4 Foundation</h1>
          <p className="text-lg text-gray-300">Information Technology Infrastructure Library</p>
          <div className="w-24 h-1 bg-[#00ffff] mx-auto mb-6 mt-4"></div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-black p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-[#00ff00] mb-4">Status: ✅ Completed</h2>
          </div>
          
          <div className="text-center pt-6">
            <Link href="/" className="bg-[#00ffff] text-black px-6 py-3 rounded-lg font-semibold hover:bg-cyan-300 transition-colors inline-block">
              ← Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 