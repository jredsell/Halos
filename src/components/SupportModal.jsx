import { X, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800/80 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
              <Heart size={20} className="text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Support HALOS</h2>
              <p className="text-xs text-neutral-400 mt-1">Keep HALOS free and fund future development.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 text-neutral-300 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-black text-white mb-4 tracking-wider">HALOS is Free for Everyone</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We built HALOS to ensure every church, regardless of budget, has access to high-quality presentation software. If you find it valuable and want to help cover basic server costs or fund new features, please consider becoming a supporter!
            </p>
          </div>

          {/* Monthly Tiers */}
          <div className="grid md:grid-cols-3 gap-6">
            
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

          <div className="pt-6 border-t border-neutral-800/80">
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

        </div>

      </div>
    </div>
  );
}
