import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink/60 backdrop-blur-md"
    >
      <div className="card-panel p-8 flex flex-col items-center max-w-sm w-full mx-4 text-center ambient-shadow">
        {/* Brass spinner */}
        <div className="relative w-10 h-10 mb-5">
          <div className="w-10 h-10 rounded-full border-2 border-line" />
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-brass border-t-transparent animate-spin" />
        </div>

        <h3 className="font-serif text-base font-medium text-text mb-1">Authenticating</h3>
        <p className="text-[13px] text-muted">Connecting your Google session...</p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
