import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface/80 backdrop-blur-xl"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border-t-2 border-primary-indigo border-opacity-50 blur-[2px]"
        />
        
        {/* Main spinning ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-4 border-transparent border-t-primary-indigo border-r-secondary-violet mesh-gradient-border shadow-[0_0_15px_rgba(114,74,167,0.5)]"
        />

        {/* Center element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full mesh-gradient shadow-lg animate-pulse" />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-bold text-on-surface mb-2">Authenticating</h3>
        <p className="text-sm text-on-surface/60 animate-pulse">Setting up your study space...</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
