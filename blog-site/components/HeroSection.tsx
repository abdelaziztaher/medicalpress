'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  // Use state to control rendering of heavy elements
  const [isLoaded, setIsLoaded] = useState(false);

  // Only render particles after component is mounted
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay - Changed colors to be medical-themed */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-blue-900/80 z-10"></div>
      
      {/* Background pattern - Simplified by removing the SVG background */}
      <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
      
      {/* Animated particles - Reduced from 20 to 8 and only render after component is mounted */}
      {isLoaded && (
        <div className="absolute inset-0 z-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.3,
                scale: Math.random() * 1 + 0.5,
              }}
              animate={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                transition: {
                  duration: Math.random() * 30 + 15, // Slower animations = less CPU
                  repeat: Infinity,
                  repeatType: 'reverse',
                },
              }}
            />
          ))}
        </div>
      )}
      
      {/* Content - Updated for better performance */}
      <div className="container relative z-20 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Reduced animation duration
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          <span className="block">Discover the Latest</span>
          <span className="block mt-2 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            in Medical Sciences
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} // Reduced animation duration and delay
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10"
        >
          Explore advanced articles on general medicine, specialized care, medical research and healthcare innovations
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} // Reduced animation duration and delay
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/category/general-medicine">
            <button className="px-8 py-3 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition-colors shadow-lg">
              Browse Articles
            </button>
          </Link>
          <Link href="/category/medical-research">
            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-colors border border-white/30">
              Medical Research
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 