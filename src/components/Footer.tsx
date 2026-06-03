import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteContent } from '../types';
import { ArrowUp, X, Shield, Scale } from 'lucide-react';

interface FooterProps {
  content: SiteContent;
}

export function Footer({ content }: FooterProps) {
  const [activeModal, setActiveModal] = useState<'privacy' | 'legal' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-20 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="bento-card p-12 md:p-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.jpg" alt="Phoenix Waterproofing" className="h-12 w-auto object-contain rounded-lg" />
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none uppercase">Phoenix</h1>
                <p className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase">Waterproofing</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mb-8">
              Top-rated waterproofing contractors in Bangalore. We provide the best waterproofing services for terrace, basement, and bathroom leakages with 10-year warranties*.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-6 font-bold">Solutions</h4>
            <ul className="space-y-4">
              {content.services.slice(0, 5).map(s => (
                <li key={s.id}>
                  <a href="#services" className="text-slate-600 hover:text-accent font-bold text-sm transition-colors">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-6 font-bold">Organization</h4>
            <ul className="space-y-4 text-slate-600 font-bold text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Quality Control</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Safety Protocols</a></li>
              <li>
                <a 
                  href="/gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/gallery');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Project Portfolio
                </a>
              </li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Join Team</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300">
            © {new Date().getFullYear()} {content.businessInfo.name}.
            <span className="text-[8px] normal-case tracking-normal italic opacity-80 mt-1 block font-medium">* Warranty duration depends on the situation and service.</span>
          </p>
          
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 bg-slate-50 hover:bg-accent border border-slate-100 hover:text-white rounded-full flex items-center justify-center transition-all group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>

          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-900 transition-colors underline decoration-accent/30 decoration-2 underline-offset-4">Privacy</button>
            <button onClick={() => setActiveModal('legal')} className="hover:text-slate-900 transition-colors underline decoration-accent/30 decoration-2 underline-offset-4">Legal</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    {activeModal === 'privacy' ? <Shield size={24} /> : <Scale size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {activeModal === 'privacy' ? 'Privacy Policy' : 'Legal Terms'}
                    </h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1 truncate">
                      {content.businessInfo.name}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-white border border-slate-200 shrink-0"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="p-8 md:p-10 overflow-y-auto space-y-6 text-sm text-slate-600 font-medium leading-relaxed">
                {activeModal === 'privacy' ? (
                  <>
                    <h4 className="font-bold text-slate-900 text-base">1. Information Collection</h4>
                    <p>We collect information you provide directly to us when requesting quotes, booking inspections, or communicating with our team. This includes your name, phone number, email address, and property details relevant to waterproofing services.</p>
                    
                    <h4 className="font-bold text-slate-900 text-base">2. Use of Information</h4>
                    <p>The information we collect is strictly used to provide, maintain, and improve our structural protection services. We use your contact details solely for scheduling site visits and dispatching technical quotations.</p>

                    <h4 className="font-bold text-slate-900 text-base">3. Data Security</h4>
                    <p>We implement reasonable security measures to protect your personal information. Your property data and contact details are never sold to third-party marketing agencies.</p>

                    <h4 className="font-bold text-slate-900 text-base">4. Contact Us</h4>
                    <p>If you have any questions about this Privacy Policy, please contact us at {content.businessInfo.email}.</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-slate-900 text-base">1. Service Agreements</h4>
                    <p>All waterproofing and structural repair services are subject to a formal site inspection. Quotations provided via this website are estimates and may change upon physical assessment of the property's condition.</p>
                    
                    <h4 className="font-bold text-slate-900 text-base">2. Warranties</h4>
                    <p>Our standard 10-year warranty applies only to specific full-system applications. Warranty terms will be explicitly stated in your final contract. The warranty does not cover damages caused by subsequent structural modifications or natural disasters. Warranty duration depends on the situation and service.</p>

                    <h4 className="font-bold text-slate-900 text-base">3. Liability</h4>
                    <p>{content.businessInfo.name} is not liable for existing structural deficiencies. Our responsibility is limited to the scope of work defined in the agreed technical specification document.</p>

                    <h4 className="font-bold text-slate-900 text-base">4. Governing Law</h4>
                    <p>These terms shall be governed by and construed in accordance with the laws of India, specifically under the jurisdiction of the courts in Bangalore, Karnataka.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
