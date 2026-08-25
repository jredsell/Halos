import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ProjectorWindow from './components/ProjectorWindow.jsx'
import LiveViewer from './components/LiveViewer.jsx'
import LandingPage from './LandingPage.jsx'
import DocsPage from './DocsPage.jsx'
import './index.css'

// Hard Route Controller
const path = window.location.pathname;
const base = import.meta.env.BASE_URL;
const normalizedPath = path.startsWith(base) ? '/' + path.slice(base.length).replace(/^\//, '') : path;

const isProjector = window.location.search.includes('projector=true');
const isLiveView = window.location.search.includes('view=live') || window.location.search.includes('network=true');

const renderApp = () => {
  if (normalizedPath === '/app' || normalizedPath === '/app/') {
    if (isProjector) return <ProjectorWindow />;
    if (isLiveView) return <LiveViewer />;
    return <App />;
  }
  
  if (normalizedPath.startsWith('/docs')) return <DocsPage />;
  
  // Legacy / fallback handling for root URL with search params
  if (normalizedPath === '/' && (isProjector || isLiveView || window.location.search.includes('room='))) {
      if (isProjector) return <ProjectorWindow />;
      if (isLiveView) return <LiveViewer />;
      return <App />;
  }

  return <LandingPage />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {renderApp()}
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swPath).catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}
