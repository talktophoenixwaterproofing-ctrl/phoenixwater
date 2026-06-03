import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronLeft, ChevronRight, Home, Image as ImageIcon } from 'lucide-react';
import { SiteContent } from '../types';
import { getGoogleDriveEmbedUrl } from '../lib/imageUtils';

interface GalleryPageProps {
  content: SiteContent;
  onClose: () => void;
}

export function GalleryPage({ content, onClose }: GalleryPageProps) {
  const images = content.gallery && content.gallery.length > 0
    ? content.gallery
    : (content.pastWorks && content.pastWorks.length > 0
        ? content.pastWorks.map(w => w.imageUrl)
        : [
            "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1590053132232-6f607474bc93?auto=format&fit=crop&q=80&w=1200"
          ]
      );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const slideDuration = 4000; // 4 seconds per slide
  const progressStep = 100 / (slideDuration / 100); // Progress updates every 100ms

  // Handle slide transition
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setProgress(0);
  };

  // Manage auto-sliding timer and progress bar
  useEffect(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isPlaying) {
      // Primary slide transition timer
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, slideDuration);

      // Increment progress bar every 100ms
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + progressStep;
        });
      }, 100);
    } else {
      setProgress(0);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentIndex, images.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -left-40 -top-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="w-full px-6 md:px-12 py-8 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/20 border border-accent/30 rounded-xl text-accent">
            <ImageIcon size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight leading-none uppercase">Phoenix Gallery</h1>
            <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">Project Completions</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white border border-white/10 hover:border-white hover:text-slate-950 text-sm font-bold transition-all backdrop-blur-md active:scale-95 shadow-lg"
        >
          <Home size={16} />
          <span>Return Home</span>
        </button>
      </header>

      {/* Slideshow Display Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
        {/* Main Slideshow Frame */}
        <div className="relative w-full aspect-[16/9] max-h-[60vh] bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-2xl flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={getGoogleDriveEmbedUrl(images[currentIndex])}
              alt={`Project image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Left/Right Arrow Navs */}
          <button 
            onClick={handlePrev}
            className="absolute left-6 w-14 h-14 rounded-full bg-black/40 hover:bg-accent border border-white/10 hover:border-accent text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={28} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-6 w-14 h-14 rounded-full bg-black/40 hover:bg-accent border border-white/10 hover:border-accent text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight size={28} />
          </button>

          {/* Bottom Progress Bar & Slide Index Overlays */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 overflow-hidden">
            {isPlaying && (
              <div 
                className="h-full bg-accent transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>

          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full text-xs font-bold tracking-widest text-slate-300">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Slideshow Player Control Panel */}
        <div className="mt-8 flex items-center gap-6 z-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-lg">
          <button 
            onClick={handlePrev}
            className="text-slate-400 hover:text-white transition-colors"
            title="Previous Photo"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
            title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-slate-400 hover:text-white transition-colors"
            title="Next Photo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      {/* Interactive Thumbnail Gallerystrip */}
      <footer className="w-full px-6 md:px-12 py-10 z-10 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-4 shrink-0">
        {/* Navigation Indicator Dots */}
        <div className="flex gap-2.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => selectSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Images strip */}
        <div className="w-full max-w-4xl overflow-x-auto flex gap-4 py-2 px-4 no-scrollbar justify-center">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => selectSlide(idx)}
              className={`w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all transform hover:scale-105 active:scale-95 ${currentIndex === idx ? 'border-accent shadow-lg shadow-accent/25' : 'border-white/10 hover:border-white/40'}`}
            >
              <img 
                src={getGoogleDriveEmbedUrl(url)} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
