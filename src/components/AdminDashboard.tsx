import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Save, X, Plus, Trash2, Home, Settings, Info, Briefcase, Phone, MapPin, Mail, LogOut, ShieldCheck, LogIn, Globe, Layers, Star, Image as ImageIcon } from 'lucide-react';
import { SiteContent, Service, SEOContent, PastWork, Testimonial } from '../types';
import { getGoogleDriveEmbedUrl } from '../lib/imageUtils';
import { getCMSMode } from '../services/contentService';

interface AdminDashboardProps {
  content: SiteContent;
  onSave: (content: SiteContent) => Promise<void> | void;
  onClose: () => void;
}

export function AdminDashboard({ content, onSave, onClose }: AdminDashboardProps) {
  const [editedContent, setEditedContent] = useState<SiteContent>(JSON.parse(JSON.stringify(content)));
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'pastWorks' | 'testimonials' | 'seo' | 'gallery'>('info');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cmsMode = getCMSMode();

  const handleGalleryChange = (index: number, value: string) => {
    const processedValue = getGoogleDriveEmbedUrl(value);
    const newGallery = [...(editedContent.gallery || [])];
    newGallery[index] = processedValue;
    setEditedContent({ ...editedContent, gallery: newGallery });
  };

  const handleAddGalleryItem = () => {
    setEditedContent({ 
      ...editedContent, 
      gallery: [...(editedContent.gallery || []), 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'] 
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    setEditedContent({ 
      ...editedContent, 
      gallery: (editedContent.gallery || []).filter((_, idx) => idx !== index) 
    });
  };

  const handlePastWorkChange = (id: string, field: keyof PastWork, value: string) => {
    const processedValue = field === 'imageUrl' ? getGoogleDriveEmbedUrl(value) : value;
    const newPastWorks = (editedContent.pastWorks || []).map(p => 
      p.id === id ? { ...p, [field]: processedValue } : p
    );
    setEditedContent({ ...editedContent, pastWorks: newPastWorks });
  };

  const handleAddPastWork = () => {
    const newPastWork: PastWork = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Completion',
      category: 'Waterproofing',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'
    };
    setEditedContent({ ...editedContent, pastWorks: [...(editedContent.pastWorks || []), newPastWork] });
  };

  const handleRemovePastWork = (id: string) => {
    setEditedContent({ 
      ...editedContent, 
      pastWorks: (editedContent.pastWorks || []).filter(p => p.id !== id) 
    });
  };

  const handleTestimonialChange = (id: string, field: keyof Testimonial, value: string | number) => {
    const processedValue = field === 'photoUrl' && typeof value === 'string' ? getGoogleDriveEmbedUrl(value) : value;
    const newTestimonials = (editedContent.testimonials || []).map(t => 
      t.id === id ? { ...t, [field]: processedValue } : t
    );
    setEditedContent({ ...editedContent, testimonials: newTestimonials });
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Client Name',
      role: 'Client Role / Company',
      comment: 'Excellent service and quality...',
      rating: 5,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    };
    setEditedContent({ ...editedContent, testimonials: [...(editedContent.testimonials || []), newTestimonial] });
  };

  const handleRemoveTestimonial = (id: string) => {
    setEditedContent({ 
      ...editedContent, 
      testimonials: (editedContent.testimonials || []).filter(t => t.id !== id) 
    });
  };

  const handleCommit = async () => {
    setIsSaving(true);
    try {
      await onSave(editedContent);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const validUser = import.meta.env.VITE_ADMIN_USER || 'admin';
    const validPass = import.meta.env.VITE_ADMIN_PASS || 'password';
    if (username === validUser && password === validPass) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleServiceChange = (id: string, field: keyof Service, value: string) => {
    const processedValue = field === 'image' ? getGoogleDriveEmbedUrl(value) : value;
    const newServices = editedContent.services.map(s => 
      s.id === id ? { ...s, [field]: processedValue } : s
    );
    setEditedContent({ ...editedContent, services: newServices });
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Service',
      description: 'Service description...',
      icon: 'Droplets'
    };
    setEditedContent({ ...editedContent, services: [...editedContent.services, newService] });
  };

  const handleRemoveService = (id: string) => {
    setEditedContent({ 
      ...editedContent, 
      services: editedContent.services.filter(s => s.id !== id) 
    });
  };

  const handleInfoChange = (field: string, value: string | string[]) => {
    setEditedContent({
      ...editedContent,
      businessInfo: { ...editedContent.businessInfo, [field]: value }
    });
  };

  const handleSEOChange = (field: keyof SEOContent, value: string) => {
    setEditedContent({
      ...editedContent,
      seo: { ...editedContent.seo, [field]: value }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-24 h-24 bg-accent/10 text-accent rounded-[2.5rem] flex items-center justify-center mb-8 border border-accent/20">
          <ShieldCheck size={48} />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Admin Protected Area</h2>
        <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
          Authorized personnel only. Please sign in with your credentials.
        </p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-left">
          <div>
             <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold" />
          </div>
          <div>
             <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold" />
          </div>
          {loginError && <p className="text-red-500 text-xs font-bold text-center">Invalid credentials</p>}
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent hover:shadow-2xl hover:shadow-accent/20 transition-all active:scale-95"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <button 
          onClick={onClose}
          className="mt-8 text-slate-400 hover:text-slate-900 font-bold text-[10px] tracking-[0.2em] uppercase"
        >
          Return to Website
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden text-slate-900 bg-slate-50 p-4 md:p-6 gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col p-6 md:p-8 shadow-sm shrink-0 lg:overflow-y-auto">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2.5 bg-accent rounded-xl text-white shadow-lg shadow-accent/20">
            <Settings size={22} />
          </div>
          <span className="font-extrabold text-xl tracking-tight">CMS Console</span>
        </div>

        <nav className="space-y-2 mb-6">
          <button 
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Info size={20} />
            Business Details
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Briefcase size={20} />
            Service Stack
          </button>
          <button 
            onClick={() => setActiveTab('pastWorks')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'pastWorks' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Layers size={20} />
            Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'testimonials' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Star size={20} />
            Testimonials
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'gallery' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <ImageIcon size={20} />
            Gallery Stack
          </button>
          <button 
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'seo' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Globe size={20} />
            Global SEO
          </button>
        </nav>

        <div className="mb-auto p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">A</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate text-slate-700">Administrator</span>
              <span className="text-[10px] text-slate-400 truncate tracking-tight">System Admin</span>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-400 hover:text-accent hover:border-accent/30 transition-all"
          >
            <LogOut size={14} />
            Terminate Session
          </button>
        </div>

        {/* Storage Connection Status */}
        <div className="mt-4 p-5 rounded-[1.5rem] border bg-slate-50 border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              cmsMode === 'git' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
              cmsMode === 'firestore' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 
              'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'
            }`} />
            <span className="font-extrabold text-slate-700">
              {cmsMode === 'git' ? 'Connected (Git-CMS)' : 
               cmsMode === 'firestore' ? 'Connected (Firestore)' : 
               'Offline Mode (Local Only)'}
            </span>
          </div>
          {cmsMode === 'offline' ? (
            <p className="text-amber-600 leading-relaxed font-semibold">
              ⚠️ Changes are saved in your current browser only. To publish globally, please configure the <strong>VITE_GITHUB_TOKEN</strong> environment variable in Vercel/Netlify.
            </p>
          ) : (
            <p className="text-slate-400 leading-relaxed font-medium">
              Changes will be saved globally to {cmsMode === 'git' ? 'GitHub' : 'Firestore'}.
            </p>
          )}
        </div>

        <div className="pt-8 border-t border-slate-100 space-y-3">
          <button 
            onClick={handleCommit}
            disabled={isSaving}
            className="w-full bg-accent text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-3 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={20} className={isSaving ? "animate-pulse" : ""} />
            {isSaving ? 'Committing...' : 'Commit Changes'}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"
          >
            <X size={20} />
            Close Portal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-y-auto lg:h-full p-6 md:p-14 shadow-sm relative">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
              {activeTab === 'info' ? 'Corporate Profile' : 
               activeTab === 'services' ? 'Technical Offerings' : 
               activeTab === 'pastWorks' ? 'Portfolio Projects' : 
               activeTab === 'testimonials' ? 'Client Testimonials' : 
               activeTab === 'gallery' ? 'Auto-Slide Gallery' :
               'SEO Optimizer'}
            </h1>
            <p className="text-slate-400 text-base font-medium">Configure global site variables and metadata.</p>
          </header>

          {activeTab === 'info' ? (
            <div className="space-y-8">
              <div className="space-y-8">
                <InputGroup 
                  label="Legal Business Name" 
                  icon={<Home size={18}/>}
                  value={editedContent.businessInfo.name}
                  onChange={(v) => handleInfoChange('name', v)}
                />
                <InputGroup 
                  label="Registered Address" 
                  icon={<MapPin size={18}/>}
                  value={editedContent.businessInfo.address}
                  onChange={(v) => handleInfoChange('address', v)}
                  isTextArea
                />
                <InputGroup 
                  label="Administrative Email" 
                  icon={<Mail size={18}/>}
                  value={editedContent.businessInfo.email}
                  onChange={(v) => handleInfoChange('email', v)}
                />
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="font-extrabold text-lg mb-6 flex items-center gap-3">
                  <Phone size={22} className="text-accent"/>
                  Hotline Numbers
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {editedContent.businessInfo.phones.map((phone, idx) => (
                    <div key={idx} className="flex gap-3 items-center group">
                      <input 
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...editedContent.businessInfo.phones];
                          newPhones[idx] = e.target.value;
                          handleInfoChange('phones', newPhones);
                        }}
                      />
                      <button 
                        onClick={() => {
                          const newPhones = editedContent.businessInfo.phones.filter((_, i) => i !== idx);
                          handleInfoChange('phones', newPhones);
                        }}
                        className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleInfoChange('phones', [...editedContent.businessInfo.phones, ''])}
                    className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-slate-400 hover:border-accent/40 hover:text-accent font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    New Contact
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'services' ? (
            <div className="space-y-4">
              {editedContent.services.map((service) => (
                <div key={service.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Service Title</label>
                        <input 
                          className="w-full text-xl font-extrabold bg-transparent border-none p-0 focus:ring-0 placeholder-slate-200"
                          placeholder="Ex: Basement Sealing"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Technical Specification</label>
                        <textarea 
                          className="w-full text-sm font-medium text-slate-500 bg-transparent border-none p-0 focus:ring-0 resize-none h-24 placeholder-slate-200 leading-relaxed"
                          placeholder="Describe the scientific approach..."
                          value={service.description}
                          onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Technical Specification (India Context)</label>
                        <textarea 
                          className="w-full text-sm font-medium text-slate-500 bg-transparent border-none p-0 focus:ring-0 resize-none h-24 placeholder-slate-200 leading-relaxed"
                          placeholder="Describe the scientific approach and materials used in India..."
                          value={service.technicalDetails || ''}
                          onChange={(e) => handleServiceChange(service.id, 'technicalDetails', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Project Gallery Image URL</label>
                        <input 
                          type="text"
                          className="w-full text-xs font-bold text-slate-400 bg-white/50 border border-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                          placeholder="Image URL for gallery of work..."
                          value={service.image || ''}
                          onChange={(e) => handleServiceChange(service.id, 'image', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end gap-6">
                      <div className="space-y-1 w-full md:w-auto">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1 block text-right">Identifier</label>
                        <select 
                          className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all cursor-pointer"
                          value={service.icon}
                          onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)}
                        >
                          <option value="Droplets">Water Drops</option>
                          <option value="Shield">Seal Shield</option>
                          <option value="Home">Structure</option>
                          <option value="Wrench">Utility</option>
                          <option value="Layers">Coating</option>
                          <option value="Droplet">Individual</option>
                          <option value="Waves">Flow</option>
                          <option value="Layout">Surface</option>
                          <option value="Wind">Duct</option>
                          <option value="Maximize2">Joint</option>
                          <option value="Database">Retaining</option>
                          <option value="Bath">Wet Area</option>
                          <option value="Grid">Epoxy</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => handleRemoveService(service.id)}
                        className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddService}
                className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 hover:border-accent/40 hover:text-accent font-extrabold flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-accent/5"
              >
                <Plus size={28} />
                <span className="text-sm tracking-widest uppercase">Inject New Service Module</span>
              </button>
            </div>
          ) : activeTab === 'pastWorks' ? (
            <div className="space-y-4">
              {(editedContent.pastWorks || []).map((work) => {
                const isFeaturedHero = work.id === 'p5';
                return (
                  <div 
                    key={work.id} 
                    className={`p-8 rounded-[2rem] border transition-all duration-300 group ${
                      isFeaturedHero 
                        ? 'bg-accent/[0.02] border-accent/30 shadow-lg shadow-accent/[0.01]' 
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    {isFeaturedHero && (
                      <div className="bg-accent/10 border border-accent/20 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3 text-accent text-xs font-extrabold uppercase tracking-widest">
                        <Home size={14} />
                        Featured Hero Section Card (Visible on Landing Page)
                      </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Project Name / Title</label>
                            <input 
                              className="w-full text-base font-bold bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                              placeholder="Ex: Basement Waterproofing"
                              value={work.title}
                              onChange={(e) => handlePastWorkChange(work.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                            <input 
                              className="w-full text-base font-bold bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                              placeholder="Ex: Structural Protection"
                              value={work.category}
                              onChange={(e) => handlePastWorkChange(work.id, 'category', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Project Image URL</label>
                          <input 
                            type="text"
                            className="w-full text-xs font-bold text-slate-400 bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                            placeholder="Image URL..."
                            value={work.imageUrl}
                            onChange={(e) => handlePastWorkChange(work.id, 'imageUrl', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        {isFeaturedHero ? (
                          <div className="text-[9px] font-extrabold text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-4 py-2.5 rounded-xl text-center select-none">
                            Locked Core Asset
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => handleRemovePastWork(work.id)}
                            className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 size={24} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={handleAddPastWork}
                className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 hover:border-accent/40 hover:text-accent font-extrabold flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-accent/5"
              >
                <Plus size={28} />
                <span className="text-sm tracking-widest uppercase">Inject New Project Completion</span>
              </button>
            </div>
          ) : activeTab === 'testimonials' ? (
            <div className="space-y-4">
              {(editedContent.testimonials || []).map((t) => (
                <div key={t.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Client Name</label>
                          <input 
                            className="w-full text-base font-bold bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                            placeholder="Ex: Rajesh Kumar"
                            value={t.name}
                            onChange={(e) => handleTestimonialChange(t.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Role / Designation</label>
                          <input 
                            className="w-full text-base font-bold bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                            placeholder="Ex: Managing Director"
                            value={t.role}
                            onChange={(e) => handleTestimonialChange(t.id, 'role', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Star Rating (1-5)</label>
                          <select 
                            className="w-full text-base font-bold bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all cursor-pointer"
                            value={t.rating}
                            onChange={(e) => handleTestimonialChange(t.id, 'rating', parseInt(e.target.value))}
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                            <option value={3}>⭐⭐⭐ (3/5)</option>
                            <option value={2}>⭐⭐ (2/5)</option>
                            <option value={1}>⭐ (1/5)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Review Comment</label>
                        <textarea 
                          className="w-full text-sm font-medium text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all h-24 placeholder-slate-200 leading-relaxed"
                          placeholder="Ex: Excellent service and highly professional team..."
                          value={t.comment}
                          onChange={(e) => handleTestimonialChange(t.id, 'comment', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Avatar Photo URL</label>
                        <input 
                          type="text"
                          className="w-full text-xs font-bold text-slate-400 bg-white border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                          placeholder="https://..."
                          value={t.photoUrl}
                          onChange={(e) => handleTestimonialChange(t.id, 'photoUrl', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <button 
                        onClick={() => handleRemoveTestimonial(t.id)}
                        className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddTestimonial}
                className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 hover:border-accent/40 hover:text-accent font-extrabold flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-accent/5"
              >
                <Plus size={28} />
                <span className="text-sm tracking-widest uppercase">Inject New Client Testimonial</span>
              </button>
            </div>
          ) : activeTab === 'gallery' ? (
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl mb-8 flex items-center gap-4 text-slate-500 text-sm font-medium leading-relaxed">
                <ImageIcon size={32} className="text-accent shrink-0" />
                <p>
                  Manage the image slides in your website's automatic slideshow gallery. Paste any direct image URL, or standard Google Drive sharing links (which are auto-translated for embed display).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(editedContent.gallery || []).map((imgUrl, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 flex flex-col justify-between group">
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center relative">
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={`Gallery Preview ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon size={36} className="text-slate-300" />
                      )}
                    </div>

                    <div className="flex gap-3 items-center">
                      <input 
                        type="text"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                        placeholder="Paste image URL here..."
                        value={imgUrl}
                        onChange={(e) => handleGalleryChange(idx, e.target.value)}
                      />
                      <button 
                        onClick={() => handleRemoveGalleryItem(idx)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Photo"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddGalleryItem}
                className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-accent/40 hover:text-accent font-extrabold flex items-center justify-center gap-3 transition-all bg-slate-50/50 hover:bg-accent/5 mt-4"
              >
                <Plus size={24} />
                <span className="text-xs tracking-widest uppercase">Add Slide Photo URL</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-8">
                <InputGroup 
                  label="Meta Title" 
                  icon={<Globe size={18}/>}
                  value={editedContent.seo?.title || ''}
                  onChange={(v) => handleSEOChange('title', v)}
                />
                <InputGroup 
                  label="Meta Description" 
                  icon={<Settings size={18}/>}
                  value={editedContent.seo?.description || ''}
                  onChange={(v) => handleSEOChange('description', v)}
                  isTextArea
                />
                <InputGroup 
                  label="Keywords (comma separated)" 
                  icon={<Globe size={18}/>}
                  value={editedContent.seo?.keywords || ''}
                  onChange={(v) => handleSEOChange('keywords', v)}
                />

                <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4">
                   <h4 className="text-sm font-extrabold flex items-center gap-2 text-blue-800">
                     <ShieldCheck size={16} />
                     Google Search Preview
                   </h4>
                   <div className="space-y-1">
                      <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                        {editedContent.seo?.title || 'Page Title Placeholder'}
                      </p>
                      <p className="text-[#006621] text-sm truncate">
                        https://phoenixwaterproofing.co/
                      </p>
                      <p className="text-[#4d5156] text-sm line-clamp-2">
                        {editedContent.seo?.description || 'This is how your website will appear in search results. Make sure to include relevant keywords for better visibility.'}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, isTextArea = false }: { label: string, icon: any, value: string, onChange: (v: string) => void, isTextArea?: boolean }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-6 -translate-y-1/2 group-focus-within:text-accent transition-colors text-slate-300">
          {icon}
        </div>
        {isTextArea ? (
          <textarea 
            className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all min-h-[140px] leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input 
            type="text"
            className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  )
}
