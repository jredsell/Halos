import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './LandingPage.jsx'
import './index.css'

// Lazily load heavy application components so the landing page loads instantly
const App = lazy(() => import('./App.jsx'));
const ProjectorWindow = lazy(() => import('./components/ProjectorWindow.jsx'));
const LiveViewer = lazy(() => import('./components/LiveViewer.jsx'));
const DocsPage = lazy(() => import('./DocsPage.jsx'));

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

// Global loading spinner for suspense fallback
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-neutral-950">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      {renderApp()}
    </Suspense>
  </StrictMode>,
)


