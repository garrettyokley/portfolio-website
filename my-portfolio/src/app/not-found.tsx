import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center font-mono text-green-400 p-8">
      <div className="text-center max-w-2xl">
        <div className="text-6xl font-bold mb-4">404</div>
        <div className="text-xl mb-8">bash: file not found</div>
        <div className="text-left bg-gray-900 border border-green-400 rounded p-4 mb-8">
          <div className="text-green-400">
            [user@portfolio-site ~]$ ls -la /requested/file
          </div>
          <div className="text-red-400">
            ls: cannot access &apos;/requested/file&apos;: No such file or directory
          </div>
        </div>
        <div className="text-gray-300 mb-8">
          The file you&apos;re looking for does not exist.
        </div>
        <div className="text-sm text-gray-400">
          <div>Available commands:</div>
          <div>• cd /  (return to home)</div>
          <div>• ls    (list available files)</div>
          <div>• help  (show all commands)</div>
        </div>
        <div className="mt-8">
          <Link 
            href="/" 
            className="inline-block bg-green-400 text-black px-6 py-2 rounded hover:bg-green-300 transition-colors font-bold"
          >
            Return to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}