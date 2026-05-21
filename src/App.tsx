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
import { INITIAL_CONTENT } from './constants';
import { SiteContent } from './types';
import { subscribeToContent, updateSiteContent } from './services/contentService';

export default function App() {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [isEditorOpen, setIsEditorOpen] = useState(() => window.location.pathname === '/admin');

  useEffect(() => {
    const handlePopState = () => setIsEditorOpen(window.location.pathname === '/admin');
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
    } catch (err) {
      alert("Failed to update content. Ensure you have admin privileges.");
    }
  };

  const closeAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsEditorOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-accent selection:text-white">
      <AnimatePresence mode="wait">
        {isEditorOpen ? (
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
              onClose={closeAdmin}
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

