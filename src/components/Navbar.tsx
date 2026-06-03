import { motion } from 'motion/react';
import { Settings, Phone } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-6 right-6 z-50 flex items-center justify-center"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg shadow-slate-200/50 rounded-full px-6 py-3 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Phoenix Waterproofing" className="h-12 w-auto object-contain rounded-lg" />
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none uppercase">Phoenix</h1>
            <p className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase">Waterproofing</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Services', 'Portfolio', 'About', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className="text-sm font-semibold text-slate-500 hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}
          <a 
            href="/gallery"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/gallery');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-sm font-semibold text-slate-500 hover:text-accent transition-colors"
          >
            Gallery
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="tel:9901009971" 
            className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:shadow-lg hover:shadow-accent/30 transition-all active:scale-95"
          >
            <Phone size={16} />
            <span>Inspection</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
