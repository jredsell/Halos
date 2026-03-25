import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function SettingsView({ roomId }) {
  const [copied, setCopied] = useState(false);
  const base = window.location.origin + window.location.pathname;
  const liveUrl = `${base}${base.endsWith('/') ? '' : '/'}?network=true${roomId ? `&room=${roomId}` : ''}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(liveUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-6 pt-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
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

    </div>
  );
}
