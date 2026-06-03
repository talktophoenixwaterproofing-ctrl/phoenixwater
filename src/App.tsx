/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/Services';
import { PastWorksSection } from './components/PastWorks';
import { ContactSection } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { GalleryPage } from './components/GalleryPage';
import { INITIAL_CONTENT } from './constants';
import { SiteContent } from './types';
import { subscribeToContent, updateSiteContent } from './services/contentService';

export default function App() {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [currentView, setCurrentView] = useState<'client' | 'admin' | 'gallery'>(() => {
    if (window.location.pathname === '/admin') return 'admin';
    if (window.location.pathname === '/gallery') return 'gallery';
    return 'client';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') setCurrentView('admin');
      else if (window.location.pathname === '/gallery') setCurrentView('gallery');
      else setCurrentView('client');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load real-time content from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToContent((newContent) => {
      if (newContent) setContent(newContent);
    });
    return () => unsubscribe();
  }, []);

  // Sync SEO metadata to window title and meta tags
  useEffect(() => {
    if (content.seo) {
      document.title = content.seo.title;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', content.seo.description);

      // Update keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', content.seo.keywords);
    }
  }, [content.seo]);

  const handleUpdateContent = async (newContent: SiteContent) => {
    try {
      await updateSiteContent(newContent);
      setContent(newContent);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(`Failed to update content: ${errMsg}\n\nEnsure you have admin privileges and valid environment configuration.`);
    }
  };

  const closeView = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('client');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-accent selection:text-white">
      <AnimatePresence mode="wait">
        {currentView === 'admin' ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-gray-50"
          >
            <AdminDashboard 
              content={content} 
              onSave={handleUpdateContent} 
              onClose={closeView}
            />
          </motion.div>
        ) : currentView === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen bg-slate-950"
          >
            <GalleryPage 
              content={content} 
              onClose={closeView}
            />
          </motion.div>
        ) : (
          <motion.div
            key="client"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <Navbar />
            <main>
              <Hero content={content} />
              <ServicesSection content={content} />
              <PastWorksSection content={content} />
              <ContactSection content={content} />
            </main>
            <Footer content={content} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

