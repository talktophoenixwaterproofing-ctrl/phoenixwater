import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { SiteContent, Service } from '../types';
import { getGoogleDriveEmbedUrl } from '../lib/imageUtils';

interface ServicesSectionProps {
  content: SiteContent;
}

const getImageUrl = (url?: string) => {
  return getGoogleDriveEmbedUrl(url);
};

export function ServicesSection({ content }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-4 block"
          >
            Specialized Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Comprehensive Structural Protection.
          </motion.h2>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 font-medium max-w-sm leading-relaxed"
        >
          We engineer tailored solutions for every structural vulnerability using industrial-grade materials.
        </motion.p>
      </div>

      {/* Premium Long Width Highlights Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl"
      >
        {/* Sleek radial gradient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl group-hover:bg-accent/25 transition-all duration-700 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 lg:divide-x divide-slate-800/80">
          <div className="flex flex-col gap-3 lg:pr-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icons.ShieldCheck size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">10-Year Warranty</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Complete peace of mind with our certified structural warranty and long-term assurance.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-6 md:pt-0 lg:pt-0 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icons.Zap size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Advanced PU & Epoxy</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              High-pressure polyurethane grouting and epoxy systems for deep micro-crack treatment.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-6 md:pt-6 lg:pt-0 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icons.CheckCircle2 size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Expertised Team</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Our highly trained, certified structural engineers handle each project with scientific precision.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-6 md:pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icons.Search size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Leak Diagnostics</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Non-destructive thermal scanning and moisture mapping for precise leak detection.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {content.services.map((service, idx) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            index={idx} 
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Technical Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      {(() => {
                        const Icon = (Icons as any)[selectedService.icon] || Icons.Shield;
                        return <Icon size={32} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {selectedService.name}
                      </h3>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                        Technical Specification
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Icons.X size={24} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Icons.Info size={14} className="text-accent" />
                       Overview
                    </h4>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {selectedService.description}
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Icons.Settings size={14} className="text-accent" />
                       Technical Fix (Common in India)
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium italic">
                      " {selectedService.technicalDetails || "Technical details under optimization for this service module."} "
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Icons.CheckCircle2 size={14} className="text-accent" />
                       Expertised Team
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Icons.CheckCircle2 size={14} className="text-accent" />
                       10-Year Warranty*
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                   <a 
                     href="#contact"
                     onClick={() => setSelectedService(null)}
                     className="w-full bg-slate-900 text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-accent transition-all active:scale-95"
                   >
                     Request Site Inspection
                     <Icons.ArrowRight size={20} />
                   </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ServiceCard({ service, index, onClick }: { service: Service, index: number, onClick: () => void, key?: string }) {
  const IconComponent = (Icons as any)[service.icon] || Icons.Droplets;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bento-card flex flex-col h-full bg-white hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 overflow-hidden p-8 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-all duration-500 mb-8 border border-slate-100">
        <IconComponent size={24} />
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-accent transition-colors tracking-tight line-clamp-1">
        {service.name}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow line-clamp-3">
        {service.description}
      </p>
      
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase group-hover:text-accent transition-colors">
        <span>Details</span>
        <Icons.ArrowUpRight size={14} />
      </div>
    </motion.div>
  );
}
