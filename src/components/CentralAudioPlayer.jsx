import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function CentralAudioPlayer({ 
    item, 
    isLiveItem, 
    playbackStatus, 
    setPresentationPaused 
}) {
    const [previewTime, setPreviewTime] = useState(0);
    const [previewDuration, setPreviewDuration] = useState(0);
    const [previewPaused, setPreviewPaused] = useState(true);
    const [previewVolume, setPreviewVolume] = useState(1);
    const audioRef = useRef(null);
    const isDragging = useRef(false);
    const preMuteVolumeRef = useRef(1);

    // Synchronize local preview state if item changes
    useEffect(() => {
        setPreviewTime(0);
        setPreviewPaused(true);
    }, [item?.url]);

    const isLive = isLiveItem;

    const time = isLive ? (playbackStatus?.time || 0) : previewTime;
    const duration = isLive ? (playbackStatus?.duration || 0) : previewDuration;
    const paused = isLive ? (playbackStatus?.paused ?? true) : previewPaused;
    const volume = isLive ? (playbackStatus?.volume ?? 1) : previewVolume;

    const formatTime = (sec) => {
        if (!sec || isNaN(sec) || sec <= 0) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (isLive) {
            const nextPaused = !paused;
            const channel = new BroadcastChannel('halos-projector-hub');
            channel.postMessage({ type: 'playback', command: nextPaused ? 'pause' : 'play', source: 'dashboard-ui' });
            channel.close();
            setPresentationPaused(nextPaused);
        } else {
            if (previewPaused) audioRef.current?.play();
            else audioRef.current?.pause();
            setPreviewPaused(!previewPaused);
        }
    };

    const handleSeek = (val) => {
        if (isLive) {
            const channel = new BroadcastChannel('halos-projector-hub');
            channel.postMessage({ type: 'playback', command: 'seek', value: val, source: 'dashboard-ui' });
            channel.close();
        } else {
            if (audioRef.current) audioRef.current.currentTime = val;
            setPreviewTime(val);
        }
    };

    const handleVolume = (val) => {
        if (isLive) {
            const channel = new BroadcastChannel('halos-projector-hub');
            channel.postMessage({ type: 'playback', command: 'volume', value: val, source: 'dashboard-ui' });
            channel.close();
        } else {
            if (audioRef.current) audioRef.current.volume = val;
            setPreviewVolume(val);
        }
    };

    const toggleMute = () => {
        if (volume > 0) {
            preMuteVolumeRef.current = volume;
            handleVolume(0);
        } else {
            handleVolume(preMuteVolumeRef.current || 1);
        }
    };

    return (
        <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-w-2xl mx-auto mt-4 relative overflow-hidden">
            {!isLive && (
                <audio 
                    ref={audioRef} 
                    src={item.url} 
                    onTimeUpdate={(e) => { if (!isDragging.current) setPreviewTime(e.target.currentTime); }}
                    onLoadedMetadata={(e) => setPreviewDuration(e.target.duration)}
                    onEnded={() => setPreviewPaused(true)}
                    onPlay={() => setPreviewPaused(false)}
                    onPause={() => setPreviewPaused(true)}
                    className="hidden" 
                />
            )}
            
            <div className={`absolute top-0 left-0 w-full h-1 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-neutral-800'}`} />

            {isLive && (
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest text-center mb-1 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Controlling Live Output
                </div>
            )}
            {!isLive && (
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center mb-1">
                    Local Preview Mode
                </div>
            )}

            <div className="flex items-center gap-5">
                <button 
                    onClick={handlePlayPause}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition active:scale-95 shadow-lg flex-shrink-0"
                >
                    {paused ? <Play size={24} fill="currentColor" className="ml-1" /> : <Pause size={24} fill="currentColor" />}
                </button>
                
                <div className="flex-1 flex flex-col gap-2">
                    <input 
                        type="range" min="0" max={duration || 100} step="0.1" 
                        value={Math.min(time, duration || 100)}
                        onMouseDown={() => isDragging.current = true}
                        onMouseUp={(e) => {
                            isDragging.current = false;
                            handleSeek(parseFloat(e.target.value));
                        }}
                        onChange={(e) => {
                            if (!isLive) setPreviewTime(parseFloat(e.target.value));
                        }}
                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs font-black font-mono tracking-tighter">
                        <span className={time > 0 ? "text-blue-400" : "text-neutral-500"}>{formatTime(time)}</span>
                        <span className={duration > 0 ? "text-neutral-400" : "text-neutral-600"}>-{formatTime(Math.max(0, duration - time))}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-32 border-l border-neutral-800 pl-5">
                    <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition">
                        {volume > 0.5 ? <Volume2 size={18} /> : volume > 0 ? <Volume2 size={18} className="opacity-60" /> : <VolumeX size={18} className="text-red-500" />}
                    </button>
                    <input 
                        type="range" min="0" max="1" step="0.05"
                        value={volume}
                        onChange={(e) => handleVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
