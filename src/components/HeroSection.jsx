import { useRef, useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import useScrollImageSequence from '../hooks/useScrollImageSequence';

const HeroSection = () => {
  const canvasRef = useRef(null);
  const { images, currentFrame, isLoaded } = useScrollImageSequence(120);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Draw current frame to canvas
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = images[currentFrame];

    if (img && img.complete) {
      // Set canvas size to window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Calculate scaling to cover entire canvas
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);

      const x = canvas.width / 2 - (img.width / 2) * scale;
      const y = canvas.height / 2 - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [currentFrame, images, isLoaded]);

  // Track scroll progress for content transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollTop / (windowHeight * 2), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative h-[300vh]">
      {/* Fixed Canvas Background */}
      <div className="fixed left-0 top-0 z-0 h-screen w-full">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="sticky top-0 z-10 flex h-screen items-center justify-center">
        <AnimatePresence>
          {scrollProgress < 0.3 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="px-4 text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex flex-col items-center gap-6 md:gap-8"
              >
                <img src="/teclogo.svg" alt="TEC Logo" className="h-20 md:h-28 lg:h-32" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 px-4 font-orbitron text-base tracking-wide text-white/90 sm:text-lg md:mb-12 md:text-2xl"
              >
                TAKE AN ENTREPRENEURSHIP CHALLENGE
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 24, 1, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-f1-red px-6 py-3 font-montserrat text-base font-bold uppercase tracking-wider shadow-red-glow transition-all duration-300 hover:shadow-red-glow-strong md:px-10 md:py-4 md:text-lg"
              >
                Start Your Engine
              </motion.button>
            </motion.div>
          )}

          {scrollProgress >= 0.3 && scrollProgress < 0.7 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="max-w-4xl px-4 text-center"
            >
              <h2 className="mb-8 font-orbitron text-5xl font-bold tracking-wide text-white md:text-7xl">
                About <span className="text-f1-red">TEC</span>
              </h2>
              <p className="font-inter text-xl leading-relaxed text-white/80 md:text-2xl">
                Tech & Entrepreneurship Challenge: A{' '}
                <span className="font-bold text-f1-red">3-Month Saga</span> of Innovation, where
                ideas accelerate from concept to reality.
              </p>
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="font-racing text-4xl text-f1-red">6</div>
                  <div className="font-montserrat text-sm text-white/60">PHASES</div>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="text-center">
                  <div className="font-racing text-4xl text-f1-red">3</div>
                  <div className="font-montserrat text-sm text-white/60">MONTHS</div>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="text-center">
                  <div className="font-racing text-4xl text-f1-red">∞</div>
                  <div className="font-montserrat text-sm text-white/60">POSSIBILITIES</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Indicator */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black">
          <div className="text-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-f1-red border-t-transparent" />
            <p className="font-orbitron text-f1-red">Loading Experience...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
