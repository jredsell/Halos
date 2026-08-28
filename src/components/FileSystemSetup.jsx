import { useState, useEffect } from 'react';
import { setStoredDirectoryHandle } from '../utils/fileSystem';
import { Folder, Download, CheckCircle2, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

const REQUIRED_FOLDERS = [
  'Songs', 
  'Images', 
  'Videos', 
  'Music', 
  'Bible'
];

export default function FileSystemSetup({ onReady }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the event fired before React mounted
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
    }
  };

  const handleInitLibrary = async () => {
    try {
      setLoading(true);
      setError('');
      // Show directory picker
      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      
      // Check for and create subfolders
      for (const folderName of REQUIRED_FOLDERS) {
        await directoryHandle.getDirectoryHandle(folderName, { create: true });
      }

      // Store handle in IndexedDB
      await setStoredDirectoryHandle(directoryHandle);
      
      onReady(directoryHandle);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to initialize library. Check browser permissions.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 sm:p-8 selection:bg-blue-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-3xl w-full flex flex-col items-center relative z-10">
        <div className="mb-12">
            <Logo showText={true} className="w-12 h-12" textClassName="text-5xl font-black tracking-widest text-white drop-shadow" />
        </div>
        
        <div className="w-full bg-neutral-900/60 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-neutral-800/80 shadow-2xl space-y-10">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">Welcome to Halos</h2>
                <p className="text-neutral-400 text-lg">Complete these two steps to initialize your presentation environment.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="bg-neutral-950/50 p-6 rounded-2xl border border-neutral-800/80 flex flex-col justify-between shadow-inner">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-neutral-800/80 text-[10px] font-bold uppercase tracking-widest rounded-full text-neutral-400">Step 1</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Install App</h3>
                        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">Install Halos as a Progressive Web App (PWA) for offline support and system integration.</p>
                    </div>
                    <button 
                        onClick={handleInstallClick}
                        disabled={!deferredPrompt || isInstalled}
                        className={`w-full py-3.5 px-4 rounded-xl transition font-medium flex items-center justify-center gap-2 ${
                        isInstalled 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default' 
                            : !deferredPrompt
                            ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed opacity-50 border border-transparent'
                            : 'bg-white hover:bg-neutral-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                        }`}
                    >
                        {isInstalled ? (
                        <><CheckCircle2 size={20} /> Installed</>
                        ) : (
                        <><Download size={20} /> {!deferredPrompt ? 'PWA Not Ready' : 'Install Halos'}</>
                        )}
                    </button>
                </div>

                {/* Step 2 */}
                <div className="bg-neutral-950/50 p-6 rounded-2xl border border-blue-900/30 flex flex-col justify-between shadow-[inset_0_0_30px_rgba(37,99,235,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-600/20 text-[10px] font-bold uppercase tracking-widest rounded-full text-blue-400 border border-blue-500/20">Step 2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">Initialize Library</h3>
                        <p className="text-sm text-neutral-400 mb-8 leading-relaxed">Select a local folder on your computer to store your songs, liturgy, images, and config.</p>
                    </div>
                    <button 
                        onClick={handleInitLibrary}
                        disabled={loading}
                        className="relative z-10 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-500/50"
                    >
                        <Folder size={20} />
                        {loading ? 'Initializing...' : 'Select Library Folder'}
                    </button>
                </div>
            </div>

            {/* Browser Info */}
            <div className="bg-neutral-950/30 border border-neutral-800/80 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                        <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-neutral-200 font-bold mb-2 text-lg">Browser Permissions Required</h4>
                        <p className="text-neutral-400 leading-relaxed mb-4 text-sm">
                            Halos requires the <strong>File System Access API</strong> to manage your local media. When you click "Select Library Folder", your browser will ask for permission to view and edit files in that folder.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-start gap-2 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> 
                                <div>
                                    <span className="font-bold text-neutral-300 block mb-0.5">Chrome / Edge / Opera</span>
                                    <span className="text-neutral-500 text-xs">Fully supported by default.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/> 
                                <div>
                                    <span className="font-bold text-neutral-300 block mb-0.5">Safari</span>
                                    <span className="text-neutral-500 text-xs">Requires v15.2+. May ask permission often.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5"/> 
                                <div>
                                    <span className="font-bold text-neutral-300 block mb-0.5">Brave</span>
                                    <span className="text-neutral-500 text-xs">Enable File System Access API in brave://flags/</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5"/> 
                                <div>
                                    <span className="font-bold text-neutral-300 block mb-0.5">Firefox</span>
                                    <span className="text-neutral-500 text-xs">Not supported. Use a Chromium browser.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-rose-400 p-4 bg-rose-900/20 border border-rose-900/50 rounded-xl text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{error}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
