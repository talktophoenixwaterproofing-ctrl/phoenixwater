import { motion } from 'motion/react';
import { Star, Quote, ArrowUpRight } from 'lucide-react';
import { SiteContent } from '../types';
import { getGoogleDriveEmbedUrl } from '../lib/imageUtils';

interface PastWorksProps {
  content: SiteContent;
}

export function PastWorksSection({ content }: PastWorksProps) {
  const pastWorks = content.pastWorks || [];
  const testimonials = content.testimonials || [];
  const galleryImages = content.gallery || [];

  // Duplicate items for continuous marquee looping
  const marqueeItems = [...pastWorks, ...pastWorks, ...pastWorks];

  return (
    <section id="portfolio" className="py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-custom {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-custom:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="max-w-2xl">
          <span className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
            Proven Track Record
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Completed Portfolio.
          </h2>
          <p className="text-slate-500 font-medium max-w-lg mt-4 leading-relaxed">
            Explore high-resolution highlights of our structural waterproofing projects across commercial and residential spaces in Bangalore.
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Gallery Container */}
      <div className="relative w-full flex items-center mb-24 overflow-hidden py-4">
        {/* Subtle left & right gradients to blend edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee-custom">
          {marqueeItems.map((work, idx) => (
            <div 
              key={`${work.id}-${idx}`}
              className="w-80 h-56 md:w-[400px] md:h-[280px] shrink-0 rounded-[2.5rem] overflow-hidden relative group cursor-pointer border border-slate-200/50 shadow-md shadow-slate-100 hover:shadow-2xl hover:border-accent/20 transition-all duration-500 bg-white"
            >
              <img 
                src={getGoogleDriveEmbedUrl(work.imageUrl) || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=600"} 
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="bg-accent/90 text-white font-extrabold tracking-widest uppercase text-[8px] px-3 py-1 rounded-full w-max mb-3 border border-white/10">
                  {work.category || "Waterproofing"}
                </span>
                <h4 className="text-white font-extrabold text-lg md:text-xl tracking-tight leading-tight group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                  {work.title}
                  <ArrowUpRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
            Customer Sentiments
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Client Success Endorsements
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={t.id}
              className="bento-card p-10 flex flex-col justify-between bg-white hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all group relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent/10 transition-colors" />
              
              <div>
                {/* Quote Icon & Rating row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < t.rating ? "currentColor" : "none"} 
                        stroke="currentColor" 
                      />
                    ))}
                  </div>
                  <Quote size={24} className="text-slate-200 group-hover:text-accent/20 transition-colors" />
                </div>

                <p className="text-slate-600 font-medium leading-relaxed italic text-sm mb-8">
                  "{t.comment}"
                </p>
              </div>

              {/* User profile details */}
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                <img 
                  src={getGoogleDriveEmbedUrl(t.photoUrl) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"} 
                  alt={t.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 group-hover:border-accent/30 transition-colors shrink-0"
                />
                <div className="flex items-center font-bold text-slate-500 overflow-hidden">
                  <div className="flex flex-col">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-none truncate">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1 truncate max-w-[200px]" title={t.role}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual Gallery Showcase */}
      {galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-32 pt-24 border-t border-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
                Visual Showcase
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Project Gallery
              </h2>
            </div>
            <a 
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/gallery');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-6 py-3.5 bg-slate-900 hover:bg-accent text-white font-bold text-sm rounded-full transition-all shadow-lg hover:shadow-accent/20 active:scale-95 flex items-center gap-2 group shrink-0 w-max"
            >
              <span>Launch Slideshow</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.slice(0, 8).map((imgUrl, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                onClick={() => {
                  window.history.pushState({}, '', '/gallery');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="aspect-square rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-md group relative cursor-pointer"
              >
                <img 
                  src={getGoogleDriveEmbedUrl(imgUrl)} 
                  alt={`Gallery work ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
