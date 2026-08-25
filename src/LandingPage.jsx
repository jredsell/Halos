import React from 'react';
import Logo from './components/Logo';
import { 
  Music, 
  Image as ImageIcon, 
  BookOpen, 
  Video, 
  Headphones, 
  MonitorPlay, 
  Settings, 
  PlayCircle,
  Heart,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const navigateToApp = () => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = base.replace(/\/$/, '') + '/app';
  };

  const navigateToDocs = () => {
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = base.replace(/\/$/, '') + '/docs';
  };

  const features = [
    {
      icon: <Music className="text-blue-400" size={24} />,
      title: "Songs",
      description: "Add your own custom songs or seamlessly import from Song Select. Organise and build your repertoire."
    },
    {
      icon: <ImageIcon className="text-purple-400" size={24} />,
      title: "Images & Presentations",
      description: "Use presentation slides natively as images, or upload PDFs to display content perfectly on screen."
    },
    {
      icon: <BookOpen className="text-amber-400" size={24} />,
      title: "Bible Integration",
      description: "Instantly add bible chapters and verses directly from YouVersion, or use your own local offline Bibles."
    },
    {
      icon: <MonitorPlay className="text-rose-400" size={24} />,
      title: "Liturgy Management",
      description: "Add and manage liturgy dynamically. Assign colours to easily indicate who should be speaking."
    },
    {
      icon: <Video className="text-emerald-400" size={24} />,
      title: "Videos",
      description: "Add local videos, YouTube, Vimeo, and other web videos directly into your presentation flow."
    },
    {
      icon: <Headphones className="text-cyan-400" size={24} />,
      title: "Local Music",
      description: "Add your local music collection to play walk-in music, backing tracks, or ambient soundscapes."
    }
  ];

  const presentFeatures = [
    "Save and import your services",
    "Live preview of what's on screen",
    "Dynamic line-per-slide adjustment",
    "Instant Blackout & Clear Text",
    "Custom Logo Display",
    "Background audio & music playback"
  ];

  const automationFeatures = [
    "Auto-play for videos and music",
    "Auto-transitions for presentation content",
    "Remote control from any device",
    "Remote display options for networked screens",
    "Song history export for CCLI reporting",
    "Customisable organisational settings"
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="w-full fixed top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <a href="#" className="text-white">Home</a>
            <button onClick={navigateToDocs} className="text-neutral-400 hover:text-white transition">Docs</button>
            <button 
              onClick={navigateToApp}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full transition shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2"
            >
              Launch App <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase tracking-widest text-blue-400 mb-8 shadow-inner">
            <Heart className="w-4 h-4" /> Fast, Easy & Volunteer Friendly
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 drop-shadow-2xl">
            Beautiful Worship.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400">
              Effortless Control.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Halos is a modern, lightweight presentation software designed to keep your focus on what matters. Seamlessly manage songs, bibles, liturgy, media, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={navigateToApp}
              className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full font-black uppercase tracking-widest transition flex items-center justify-center gap-3 text-sm shadow-xl"
            >
              Start Presenting <ArrowRight size={18} />
            </button>
            <button 
              onClick={navigateToDocs}
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition text-sm flex items-center justify-center gap-2"
            >
              Read the Docs
            </button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 px-6 bg-neutral-900/30 border-y border-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-widest uppercase mb-4">Everything You Need</h2>
            <p className="text-neutral-400 font-medium">A complete suite of tools built specifically for modern church services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:bg-neutral-800/80 transition group">
                <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-neutral-800/50 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black tracking-widest uppercase mb-8">Flawless<br/><span className="text-blue-400">Presenting</span></h2>
            <ul className="space-y-4">
              {presentFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-300 font-medium bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50">
                  <PlayCircle className="text-blue-500 shrink-0" size={20} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-widest uppercase mb-8">Powerful<br/><span className="text-rose-400">Automation</span></h2>
            <ul className="space-y-4">
              {automationFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-300 font-medium bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50">
                  <Settings className="text-rose-500 shrink-0" size={20} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sponsorship / Donate */}
      <section className="py-24 px-6 bg-gradient-to-b from-neutral-900/30 to-neutral-950 border-t border-neutral-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-widest uppercase mb-4">Support Halos</h2>
            <p className="text-neutral-400 font-medium">
              We built HALOS to ensure every church, regardless of budget, has access to high-quality presentation software. If you find it valuable and want to help cover basic server costs or fund new features, please consider becoming a supporter!
            </p>
          </div>

          {/* Monthly Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Tier 1 */}
            <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden transition-colors hover:border-blue-500/50 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-500 to-blue-600/0 opacity-50"></div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">HALOS Supporter</h4>
              <div className="text-3xl font-black text-white mb-4">£5<span className="text-sm text-neutral-500 font-medium">/mo</span></div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6 flex-1">
                Thank you for keeping HALOS free! Your monthly support helps cover basic server costs and keeps the project alive for churches with zero budget.
              </p>
              <a 
                href="https://buy.stripe.com/5kQ14mekn2eBgmbfSi1wY00"
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Select Tier <ExternalLink size={14} />
              </a>
            </div>

            {/* Tier 2 */}
            <div className="bg-neutral-950/80 border border-rose-500/30 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden transition-all hover:border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.05)] hover:shadow-[0_0_40px_rgba(244,63,94,0.1)] group transform md:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600/0 via-rose-500 to-rose-600/0"></div>
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-rose-500/10 rounded-full blur-xl"></div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2 group-hover:text-rose-400 transition-colors"><Sparkles size={16} className="text-rose-500" /> HALOS Partner</h4>
              <div className="text-3xl font-black text-white mb-4">£15<span className="text-sm text-neutral-500 font-medium">/mo</span></div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6 flex-1">
                A huge thank you! Your partnership directly funds the ongoing development of new features, bug fixes, and maintenance.
              </p>
              <a 
                href="https://buy.stripe.com/28E7sK2BF9H3gmb6hI1wY01"
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
              >
                Select Tier <ExternalLink size={14} />
              </a>
            </div>

            {/* Tier 3 */}
            <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden transition-colors hover:border-amber-500/50 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 opacity-50"></div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">HALOS Champion</h4>
              <div className="text-3xl font-black text-white mb-4">£30<span className="text-sm text-neutral-500 font-medium">/mo</span></div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6 flex-1">
                Thank you for championing this software! Your generous support ensures HALOS remains a high-quality, free resource for churches everywhere.
              </p>
              <a 
                href="https://buy.stripe.com/3cI3cub8b1axb1R9tU1wY02"
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Select Tier <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <h4 className="text-lg font-bold text-white mb-2">One-Time Support</h4>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                A one-time gift to support the development of HALOS. Thank you for keeping this software free! (Defaults to £25, but you can enter any amount over £5 that suits you).
              </p>
            </div>
            <a 
              href="https://buy.stripe.com/9B628qa477yV9XNfSi1wY03"
              target="_blank" rel="noopener noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-neutral-600 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition flex items-center gap-2 flex-shrink-0"
            >
              Give Once <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-800/50 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo showText={true} className="w-5 h-5" textClassName="text-sm font-black tracking-widest text-neutral-400" />
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-neutral-500">
            <button onClick={navigateToDocs} className="hover:text-white transition">Documentation</button>
            <button onClick={navigateToApp} className="hover:text-white transition">Launch App</button>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
          </div>
          <div className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Halos Presentation Software. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
