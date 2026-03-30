import { defineConfig } from 'vite' // Halos V2 Deployment
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Simple in-memory broadcast hub with Room ID sharding
const halosBroadcastPlugin = () => {
  return {
    name: 'halos-broadcast',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const url = urlObj.pathname;
        const roomId = urlObj.searchParams.get('room') || 'default';
        
        // SongSelect Search Proxy
        if (url === '/api/songselect-search') {
           const urlObj = new URL(req.url, `http://${req.headers.host}`);
           const query = urlObj.searchParams.get('q');
           
           if (!query) {
             res.end(JSON.stringify({ error: 'Missing query' }));
             return;
           }

           const searchUrl = `https://songselect.ccli.com/search/results?searchterm=${encodeURIComponent(query)}`;
           
           try {
             // Spoof standard browser headers to bypass CCLI Cloudflare walls
             const result = await fetch(searchUrl, {
               headers: {
                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                 'Accept-Language': 'en-US,en;q=0.5'
               }
             });
             const body = await result.text();
             res.setHeader('Content-Type', 'text/html');
             res.end(body);
           } catch (e) {
             res.statusCode = 500;
             res.end(JSON.stringify({ error: e.message }));
           }
           return;
        }

        // NEW: Lyrics.ovh Proxy
        if (url === '/api/lyrics-ovh') {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          const artist = urlObj.searchParams.get('artist');
          const title = urlObj.searchParams.get('title');
          if (!artist || !title) {
            res.end(JSON.stringify({ error: 'Missing artist or title' }));
            return;
          }
          const targetUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
          
          try {
            const result = await fetch(targetUrl);
            const body = await result.text();
            res.setHeader('Content-Type', 'application/json');
            res.end(body);
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // NEW: Universal Web Search Proxy (DuckDuckGo Lite)
        if (url === '/api/universal-search') {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          const query = urlObj.searchParams.get('q');
          if (!query) {
            res.end(JSON.stringify({ error: 'Missing query' }));
            return;
          }
          
          // Use Lite API, fetch will natively follow the 302 redirects that https.get failed on
          const targetUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query + ' lyrics')}`;
          
          try {
            const result = await fetch(targetUrl, {
               headers: {
                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                 'Accept': 'text/html,application/xhtml+xml'
               }
            });
            const body = await result.text();
            res.setHeader('Content-Type', 'text/html');
            res.end(body);
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        next();
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  base: '/halos/',
  server: {
    host: true, // Expose to local network automatically
    port: 5178, // Bypassing Redly's cached port
  },
  plugins: [
    halosBroadcastPlugin(),
    tailwindcss(),
    react(),
  ],
})
