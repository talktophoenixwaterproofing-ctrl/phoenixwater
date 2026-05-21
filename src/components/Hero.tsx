import { motion } from 'motion/react';
import { SiteContent } from '../types';
import { ArrowRight, Trophy, Users, ShieldCheck, Zap } from 'lucide-react';
import { getGoogleDriveEmbedUrl } from '../lib/imageUtils';

interface HeroProps {
  content: SiteContent;
}

export function Hero({ content }: HeroProps) {
  // Dynamic lookup for the Building Renovation / STP Coating past work item (associated with 'p5')
  const stpWork = content.pastWorks?.find(w => w.id === 'p5') || content.pastWorks?.[4];
  const stpImageUrl = stpWork?.imageUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000";
  const stpTitle = stpWork?.title || "Building Renovation & Construction";
  const stpCategory = stpWork?.category || "Project Site & Structural Restoration, 2024";
  return (
    <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 grid-rows-7 md:grid-rows-5 gap-4 h-[1400px] md:h-[850px]">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="col-span-12 md:col-span-8 row-span-3 bento-card p-10 md:p-14 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-6 block"
          >
            Scientific Protection since 2020
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Best <span className="text-accent">Waterproofing</span> <br />Services in Bangalore.
          </h1>
          <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-10 font-medium">
            We specialize in long-term structural integrity. From foundation to terrace, we ensure your assets remain bone-dry.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#contact" 
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-accent hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95"
            >
              Book Inspection
              <ArrowRight size={20} />
            </a>
            <a 
              href="https://wa.me/919901009971?text=Hello%20Phoenix%20Waterproofing%2C%20I%20would%20like%20to%20book%20a%20site%20inspection."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-[#20ba5a] hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
              aria-label="WhatsApp Chat"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Dynamic Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="col-span-12 md:col-span-4 row-span-2 bento-card-dark p-10 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="text-accent" size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">5+ Years</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Proven track record across Bangalore's major residential and industrial landscapes.
            </p>
          </div>
          <div className="flex -space-x-3 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                ISO
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-accent border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
              5★
            </div>
          </div>
        </motion.div>

        {/* Small Highlight Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-4 row-span-1 bento-card p-6 flex items-center gap-5"
        >
          <div className="w-12 h-12 bg-slate-50 text-accent rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Lifetime Support</h4>
            <p className="text-xs text-slate-400">Post-project maintenance</p>
          </div>
        </motion.div>

        {/* Large Visual/Image Card - Building Renovation & Construction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="col-span-12 md:col-span-8 row-span-2 rounded-[2.5rem] relative overflow-hidden group bg-slate-200"
        >
          <img 
            src={getGoogleDriveEmbedUrl(stpImageUrl)} 
            alt={stpTitle}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/35 to-transparent flex flex-col justify-end p-10 md:p-14">
            <h4 className="text-white font-extrabold text-2xl md:text-3xl mb-2 tracking-tight">{stpTitle}</h4>
            <p className="text-white/80 text-xs md:text-sm font-bold uppercase tracking-widest">{stpCategory}</p>
          </div>
        </motion.div>

        {/* Small Highlight Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="col-span-12 md:col-span-4 row-span-1 bento-card p-6 flex items-center gap-5"
        >
          <div className="w-12 h-12 bg-accent/5 text-accent rounded-2xl flex items-center justify-center shrink-0 border border-accent/10">
            <Zap size={24} fill="currentColor" fillOpacity={0.1} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Quick Response</h4>
            <p className="text-xs text-slate-400">Diagnostic visits in 24h</p>
          </div>
        </motion.div>

        {/* Small Highlight Card 3 (Completes Grid Balance) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="col-span-12 md:col-span-4 row-span-1 bento-card p-6 flex items-center gap-5"
        >
          <div className="w-12 h-12 bg-slate-50 text-accent rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
            <Users size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Expert Engineers</h4>
            <p className="text-xs text-slate-400">15+ trained structural specialists</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
