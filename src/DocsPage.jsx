import React from 'react';
import Logo from './components/Logo';
import { BookOpen, FileText, Settings, PlayCircle, Video, Image as ImageIcon } from 'lucide-react';

export default function DocsPage() {
  const navigateToHome = () => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = base;
  };

  const navigateToApp = () => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = base.replace(/\/$/, '') + '/app';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="w-full fixed top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={navigateToHome} className="flex items-center">
            <Logo />
          </button>
          <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <button onClick={navigateToHome} className="text-neutral-400 hover:text-white transition">Home</button>
            <a href="#" className="text-white">Docs</a>
            <button 
              onClick={navigateToApp}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full transition shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Docs Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full pt-20">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-800/50 hidden md:block py-10 pr-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="text-xs font-black tracking-widest uppercase text-neutral-500 mb-6">Getting Started</div>
          <ul className="space-y-3 mb-10">
            <li><a href="#" className="text-blue-400 font-medium">Introduction</a></li>
            <li><a href="#" className="text-neutral-400 hover:text-white transition font-medium">Installation & Setup</a></li>
          </ul>

          <div className="text-xs font-black tracking-widest uppercase text-neutral-500 mb-6">Features</div>
          <ul className="space-y-3 mb-10">
            <li><a href="#" className="text-neutral-400 hover:text-white transition font-medium flex items-center gap-2"><BookOpen size={16}/> Songs & Bible</a></li>
            <li><a href="#" className="text-neutral-400 hover:text-white transition font-medium flex items-center gap-2"><ImageIcon size={16}/> Media & Slides</a></li>
            <li><a href="#" className="text-neutral-400 hover:text-white transition font-medium flex items-center gap-2"><PlayCircle size={16}/> Live Presenting</a></li>
          </ul>

          <div className="text-xs font-black tracking-widest uppercase text-neutral-500 mb-6">Advanced</div>
          <ul className="space-y-3">
            <li><a href="#" className="text-neutral-400 hover:text-white transition font-medium flex items-center gap-2"><Settings size={16}/> Settings & Networking</a></li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 py-10 px-6 md:pl-16">
          <h1 className="text-4xl font-black tracking-tight mb-4">Introduction to Halos</h1>
          <p className="text-xl text-neutral-400 mb-12">Learn how to configure, present, and manage your church services with Halos.</p>
          
          <div className="prose prose-invert prose-blue max-w-3xl">
            <p className="leading-relaxed text-neutral-300">
              Halos is built to be a lightweight, modern, and completely free alternative to bulky presentation software. It runs entirely within your browser or as a PWA, meaning there are no heavy installations required, and it's compatible across operating systems.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-neutral-800 pb-2">Adding Your First Song</h2>
            <div className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-500 mb-6 border-dashed">
              <ImageIcon className="mb-4 opacity-50" size={32} />
              <span className="font-medium text-sm">[ Holding Point for Screenshot: Adding a Song ]</span>
            </div>
            <p className="leading-relaxed text-neutral-300">
              Adding a song is as simple as dragging and dropping a text file, or clicking the "+ New" button in the Songs library to write or paste your own.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-neutral-800 pb-2">Networked Remote Display</h2>
            <div className="w-full h-96 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-500 mb-6 border-dashed">
              <Video className="mb-4 opacity-50" size={48} />
              <span className="font-medium text-sm">[ Holding Point for Video Tutorial: Network Displays ]</span>
            </div>
            <p className="leading-relaxed text-neutral-300">
              You don't need expensive hardware to mirror displays. With Halos, any device with a browser can connect to your session as a remote display.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
}
