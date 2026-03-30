import { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import OutputScreen from './OutputScreen';

const LiveViewer = () => {
  const [networkPayload, setNetworkPayload] = useState(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const mediaMapCache = useRef({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (!roomId) return;

    let peer = null;

    try {
      peer = new Peer();
      
      peer.on('open', () => {
        const conn = peer.connect('halos-' + roomId);
        
        conn.on('data', (data) => {
          if (data?.type === 'state') {
             const payload = data.payload;
             // Remap blob references matching cache
             if (payload.logoUrl?.startsWith('blob:') && mediaMapCache.current[payload.logoUrl]) {
                payload.logoUrl = mediaMapCache.current[payload.logoUrl];
             }
             if (payload.activeMediaUrl?.startsWith('blob:') && mediaMapCache.current[payload.activeMediaUrl]) {
                payload.activeMediaUrl = mediaMapCache.current[payload.activeMediaUrl];
             }
             if (payload.mediaType === 'image' || payload.mediaType === 'slide_deck') {
                if (payload.activeSlide && Array.isArray(payload.activeSlide)) {
                   payload.activeSlide = payload.activeSlide.map(item => {
                      if (item.url?.startsWith('blob:') && mediaMapCache.current[item.url]) {
                         return { ...item, url: mediaMapCache.current[item.url] };
                      }
                      return item;
                   });
                }
             }
             
             setNetworkPayload(payload);
          } else if (data?.type === 'media') {
             // Reconstruct isolated binary Buffer to local memory blob map
             const blob = new Blob([data.data], { type: data.mime || 'application/octet-stream' });
             const localUrl = URL.createObjectURL(blob);
             mediaMapCache.current[data.id] = localUrl;
          }
        });
        
        conn.on('close', () => {
           console.log("Master WebRTC connection closed");
        });
      });
    } catch (e) {
      console.error(e);
    }
    
    return () => {
       if (peer) peer.destroy();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      const targetW = 1600;
      const targetH = 900;
      
      const scaleX = clientWidth / targetW;
      const scaleY = clientHeight / targetH;
      const s = Math.max(scaleX, scaleY); // Cover viewport
      setScale(s);
    };

    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    handleResize();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-screen bg-black overflow-hidden relative font-sans select-none">
       <OutputScreen 
          payload={networkPayload || { isLive: false }} 
          isLiveBroadcast={true} 
       />
       
       <div className="fixed bottom-4 right-6 text-[10px] font-black text-white/50 uppercase tracking-widest pointer-events-none z-50">
          Halos Live View • WebRTC Secure Tunnel
       </div>
    </div>
  );
};

export default LiveViewer;
