import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { SiteContent } from '../types';

interface ContactSectionProps {
  content: SiteContent;
}

export function ContactSection({ content }: ContactSectionProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    // Vercel deployment: Set VITE_WEB3FORMS_ACCESS_KEY in your Vercel Environment Variables
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setStatusMessage("Your inquiry has been dispatched successfully.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setStatusMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage("Failed to send inquiry. Please try again later.");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 grid-rows-auto gap-4">
        {/* Contact Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="col-span-12 lg:col-span-12 bento-card p-12 md:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden mb-4"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-accent font-extrabold text-xs uppercase tracking-[0.3em] mb-6 block"
          >
            Communication Portal
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-3xl">
            Ready to secure your <span className="text-accent">built assets?</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed mb-10">
            Our diagnostic team is standing by to provide a technical feasibility study for your property.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <Clock className="text-accent" size={24} />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Response</p>
                <p className="text-sm font-bold text-slate-800">Under 24h</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-accent" size={24} />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Certified</p>
                <p className="text-sm font-bold text-slate-800">Technical Team</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-12 lg:col-span-5 bento-card-accent p-10 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <h3 className="text-2xl font-extrabold leading-tight">Direct Support Channels</h3>

            <div className="space-y-6">
              <ContactInfoItem
                icon={<Phone size={20} />}
                title="Phone"
                details={content.businessInfo.phones}
              />
              <ContactInfoItem
                icon={<Mail size={20} />}
                title="Email"
                details={[content.businessInfo.email]}
              />
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Office</h4>
                  <p className="text-sm font-bold leading-relaxed">{content.businessInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/place/Sunrise+Water+Proofing+Services/@12.8455122,77.62818,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 group block overflow-hidden rounded-[2rem] relative h-64 border border-white/20 shadow-2xl hover:border-accent/50 transition-all duration-500"
          >
            <div className="absolute inset-0 z-10 pointer-events-none group-hover:bg-accent/5 transition-colors" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.845233152541!2d77.62560507590861!3d12.84551741743513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b005d168b8d%3A0xe865101cc41e2468!2sSunrise%20Water%20Proofing%20Services!5e0!3m2!1sen!2sin!4v1716066223455!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale invert brightness-90 opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl font-extrabold tracking-widest uppercase text-[9px] text-white border border-white/10 flex items-center gap-2">
                <MapPin size={12} className="text-accent" />
                Bangalore HQ
              </span>
            </div>
            <div className="absolute bottom-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="bg-accent text-white px-4 py-2 rounded-xl font-extrabold tracking-widest uppercase text-[9px] flex items-center gap-2 shadow-xl shadow-accent/20">
                Open in Maps
                <ArrowUpRight size={12} />
              </span>
            </div>
          </a>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-7 bento-card p-10 md:p-14"
        >
          <h3 className="text-2xl font-extrabold text-slate-900 mb-10 tracking-tight">Technical Project Query</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-1">Name</label>
                <input name="name" required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-sm" placeholder="Contact Person" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-1">Phone</label>
                <input name="phone" required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-sm" placeholder="Cell Number" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-1">Managed Service</label>
              <select name="service" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-sm appearance-none">
                {content.services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-1">Requirements Brief</label>
              <textarea name="message" required rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-sm resize-none" placeholder="Details about leaks or project scope..."></textarea>
            </div>

            {statusMessage && (
              <div className={`p-4 rounded-xl text-sm font-bold ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {statusMessage}
              </div>
            )}

            <button disabled={status === 'submitting'} className="w-full disabled:opacity-70 disabled:cursor-not-allowed bg-slate-900 text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-accent hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-[0.98]">
              {status === 'submitting' ? 'Dispatching...' : 'Dispatch Inquiry'}
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function ContactInfoItem({ icon, title, details }: { icon: any, title: string, details: string[] }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{title}</h4>
        {details.map((d, i) => (
          <p key={i} className="text-sm font-bold leading-relaxed">{d}</p>
        ))}
      </div>
    </div>
  );
}
