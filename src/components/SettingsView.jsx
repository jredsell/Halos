import { Share2, Copy, Check, Building2, Music } from 'lucide-react';
import { useState } from 'react';
import { getSongHistory, exportHistoryCSV } from '../services/historyService';

export default function SettingsView({ roomId, churchName, setChurchName, onChangeLibrary, youVersionApiKey, setYouVersionApiKey }) {
  const [ccliFromDate, setCcliFromDate] = useState(() => {
     const d = new Date();
     d.setDate(d.getDate() - 30);
     return d.toISOString().split('T')[0];
  });
  const [ccliToDate, setCcliToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleExportCCLI = async () => {
     const from = new Date(ccliFromDate);
     const to = new Date(ccliToDate);
     const records = await getSongHistory(from, to);
     if (records.length === 0) {
         alert("No songs played in this date range.");
         return;
     }
     exportHistoryCSV(records);
  };

  const [copied, setCopied] = useState(false);
  const base = window.location.origin + window.location.pathname;
  const liveUrl = `${base}${base.endsWith('/') ? '' : '/'}?network=true${roomId ? `&room=${roomId}` : ''}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(liveUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNameBlur = async () => {
    try {
      const { set } = await import('idb-keyval');
      await set('halos_church_name', churchName);
    } catch(e) {}
  };

  const [savingKey, setSavingKey] = useState(false);
  const handleSaveApiKey = async () => {
    setSavingKey(true);
    try {
      const { set } = await import('idb-keyval');
      await set('halos_youversion_api_key', youVersionApiKey);
      setTimeout(() => setSavingKey(false), 1000);
    } catch(e) {
      setSavingKey(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 pb-12 gap-6 pt-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
         <Share2 size={14} className="text-blue-400" /> Network Setup & Sharing
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center gap-4 shadow-xl">
        <div className="bg-white p-2 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
        </div>
        <div className="text-center">
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Live Broadcast URL</div>
            <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800 group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={handleCopy}>
                <code className="text-[11px] text-blue-400 font-bold">{liveUrl}</code>
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-neutral-600 group-hover:text-blue-400 transition-colors" />}
            </div>
            {copied && <div className="text-[9px] text-green-500 font-bold mt-1 animate-pulse">Copied to clipboard!</div>}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl mt-4">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
           <Building2 size={14} className="text-blue-400" /> Organization Profile
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Church / Organization Name</label>
            <input 
               type="text" 
               value={churchName || ""} 
               onChange={(e) => setChurchName(e.target.value)}
               onBlur={handleNameBlur}
               placeholder="e.g. Grace Fellowship"
               className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
            />
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
               This name will be displayed gracefully on the network waiting screens and the main projector output when no media is playing.
            </p>
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex justify-between">
                YouVersion API Key
                <a href="https://platform.youversion.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get Key</a>
            </label>
            <div className="flex gap-2">
                <input 
                   type="password" 
                   value={youVersionApiKey || ""} 
                   onChange={(e) => setYouVersionApiKey(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter') handleSaveApiKey(); }}
                   placeholder="Enter API Key"
                   className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                />
                <button 
                   onClick={handleSaveApiKey}
                   className={`px-5 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all border ${
                      savingKey 
                        ? 'bg-green-600/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                        : 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/40'
                   }`}
                >
                   {savingKey ? 'Saved!' : 'Save'}
                </button>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
               Required for fetching Bible translations and verses from the YouVersion API.
            </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center gap-4 shadow-xl mt-4">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2 w-full">
           <Share2 size={14} className="text-blue-400" /> Remote Control Setup
        </div>
        <div className="bg-white p-2 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(base + '?remoteControl=' + roomId)}`} alt="Remote Control QR Code" className="w-32 h-32" />
        </div>
        <div className="text-center w-full">
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Remote Control URL</div>
            <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800 group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => {
                navigator.clipboard.writeText(base + '?remoteControl=' + roomId);
            }}>
                <code className="text-[11px] text-blue-400 font-bold break-all flex-1 text-left">{base}?remoteControl={roomId}</code>
                <Copy size={12} className="text-neutral-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
               Scan this code with a phone or tablet to control the live presentation remotely.
            </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl mt-4">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
           <Music size={14} className="text-blue-400" /> Song History (CCLI Reporting)
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Date Range</label>
            <div className="flex gap-4 items-center">
               <div className="flex-1 flex flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 uppercase font-bold">From</span>
                   <input type="date" value={ccliFromDate} onChange={e => setCcliFromDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium" />
               </div>
               <div className="flex-1 flex flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 uppercase font-bold">To</span>
                   <input type="date" value={ccliToDate} onChange={e => setCcliToDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium" />
               </div>
            </div>
            <button 
               onClick={handleExportCCLI}
               className="mt-2 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
               Export to CSV
            </button>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
               Export a list of songs played between these dates to report to CCLI.
            </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl mt-4">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
           <Building2 size={14} className="text-blue-400" /> Storage Settings
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Media Library Location</label>
            <button 
               onClick={onChangeLibrary}
               className="w-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700/50 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
               Change Media Library Folder
            </button>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
               Click this to select a new base folder for your HALOS library. This will reload the application.
            </p>
        </div>
      </div>

    </div>
  );
}
