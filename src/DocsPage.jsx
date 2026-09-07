import React, { useState } from 'react';
import Logo from './components/Logo';
import { BookOpen, FileText, Settings, PlayCircle, Video, Image as ImageIcon, X } from 'lucide-react';

export default function DocsPage() {
  const base = import.meta.env.BASE_URL || '/';
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const navigateToHome = () => {
    window.location.href = base;
  };

  const navigateToApp = () => {
    window.location.href = base.replace(/\/$/, '') + '/app';
  };

  const renderContent = () => {
    return (
      <>
        <h1 className="text-4xl font-black tracking-tight mb-4">Installation & Setup</h1>
        <p className="text-xl text-neutral-400 mb-12">Halos is a modern, lightweight application built to run smoothly on your device. Once installed, you can even use the application completely offline!</p>
        
        <div className="prose prose-invert prose-blue max-w-3xl">
          <p className="leading-relaxed text-neutral-300 mb-8">Follow these simple steps to get set up:</p>
          
          <h3 className="text-xl font-bold text-white mb-4">Step 1: Launch the App</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">Click the <strong>Launch App</strong> button at the top of the screen.</p>
          <img 
            src={`${base}docs/installation-step-1.png`} 
            alt="Launch App Button" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-1.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 2: Install Halos</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">Then click on the <strong>Install Halos</strong> button.</p>
          <img 
            src={`${base}docs/installation-step-2.png`} 
            alt="Install Halos Button" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-2.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 3: Confirm Installation</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">This will ask you to confirm the app installation.</p>
          <img 
            src={`${base}docs/installation-step-3.png`} 
            alt="Confirm App Installation" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-3.png`)}
          />
          
          <h3 className="text-xl font-bold text-white mb-4">Step 4: Select Library Folder</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">Once installed, the app will open in another window. You need to set the location where you want the application to store and read your files. Click on <strong>Select Library Folder</strong>.</p>
          <img 
            src={`${base}docs/installation-step-4.png`} 
            alt="Select Library Folder" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-4.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 5: Create a New Folder</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">This will open up an explorer window. Browse to where you want the folder to be (for example, your Documents folder), and click on <strong>New Folder</strong>.</p>
          <img 
            src={`${base}docs/installation-step-5.png`} 
            alt="Create New Folder" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-5.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 6: Select the Folder</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">Call the folder "Halos", then highlight it and press <strong>Select Folder</strong>.</p>
          <img 
            src={`${base}docs/installation-step-6.png`} 
            alt="Select Folder" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-6.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 7: Grant Permissions</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">You must allow the application to have access to the folder to read and write. The pop-up will ask you to confirm if you allow this site to edit files — click <strong>Allow</strong>.</p>
          
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-blue-200 m-0"><strong className="text-blue-400">💡 Tip:</strong> Giving permission ensures your songs, liturgies, and images are saved securely directly on your own computer, which is what allows you to use Halos even when you don't have internet access!</p>
          </div>
          
          <img 
            src={`${base}docs/installation-step-7.png`} 
            alt="Allow Permissions Pop-up" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-7.png`)}
          />

          <h3 className="text-xl font-bold text-white mb-4">Step 8: Welcome to Halos!</h3>
          <p className="leading-relaxed text-neutral-300 mb-6">Congratulations. Welcome to Halos — Church Presentation Software.</p>
          <img 
            src={`${base}docs/installation-step-8.png`} 
            alt="Welcome to Halos" 
            className="rounded-xl border border-neutral-800 shadow-lg mb-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(`${base}docs/installation-step-8.png`)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm overflow-auto flex"
          onClick={() => { setSelectedImage(null); setIsZoomed(false); }}
        >
          <button 
            className="fixed top-6 right-6 md:top-8 md:right-8 z-50 text-neutral-400 hover:text-white transition bg-neutral-900/80 p-3 rounded-full hover:bg-neutral-800 shadow-lg"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setIsZoomed(false); }}
          >
            <X size={24} />
          </button>
          
          <div className={`m-auto p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${isZoomed ? 'min-w-[150vw] min-h-[150vh]' : 'w-full h-full'}`}>
            <img 
              src={selectedImage} 
              alt="Expanded view" 
              className={`rounded-xl shadow-2xl border border-neutral-800 transition-all duration-300 ease-out ${isZoomed ? 'cursor-zoom-out w-full max-w-none' : 'cursor-zoom-in max-w-full max-h-[85vh] object-contain'}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsZoomed(!isZoomed); 
              }} 
            />
          </div>
        </div>
      )}

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
            <li>
              <button 
                className="transition font-medium text-blue-400"
              >
                Installation & Setup
              </button>
            </li>
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
          {renderContent()}
        </main>
      </div>

    </div>
  );
}
