import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  SearchX, 
  Compass, 
  Sparkles,
  RotateCw,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Smooth entrance transition matching ALearn design system
  const smoothTransition = {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  };

  const dashboardPath = user ? '/dashboard' : '/';
  const decksPath = user ? '/selection' : '/dashboard';

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      
      {/* Background Subtle AI/Knowledge Grid & Glow Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-brass-soft/30 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="w-[300px] h-[300px] bg-sage/10 rounded-full blur-2xl opacity-30"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Floating Academic Visual Concept: A Lost Flashcard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={smoothTransition}
          className="mb-10 flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ 
              y: [-6, 6, -6],
              rotate: [-1, 1, -1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut" 
            }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative cursor-pointer group perspective-1000"
            title="Click to flip the lost flashcard"
          >
            {/* Outer subtle glow indicator */}
            <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-brass/20 via-brass-soft/10 to-sage/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>

            {/* The Flashcard Container */}
            <div className="relative card-paper w-[300px] sm:w-[340px] h-[190px] p-6 flex flex-col justify-between ambient-shadow border border-line-paper rounded-[4px] select-none transform transition-transform duration-300 group-hover:scale-[1.02]">
              
              {/* Paper Tape Strip Header */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-paper/90 rounded-b-[2px] shadow-xs border-x border-b border-black/10 flex items-center justify-center">
                <div className="w-8 h-[1px] bg-black/15"></div>
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-line-paper text-[11.5px] text-[#5c5747]">
                <span className="font-serif text-[13.5px] text-paper-ink font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#8a6a2f]" />
                  Concept #404
                </span>
                <span className="flex items-center gap-1.5 font-medium text-rust">
                  <span className="dot-review"></span>
                  Unmapped Route
                </span>
              </div>

              {/* Card Body */}
              <div className="py-2 flex flex-col items-center justify-center text-center">
                <div className="text-[10.5px] text-[#8a8265] uppercase tracking-wider font-semibold mb-1">
                  {isFlipped ? 'Resolution' : 'Query'}
                </div>
                {isFlipped ? (
                  <p className="text-[13.5px] font-medium leading-snug text-[#232019]">
                    Redirect your focus to the active study decks or dashboard.
                  </p>
                ) : (
                  <p className="font-serif text-[16px] font-medium text-paper-ink leading-snug">
                    "Where has this requested page gone?"
                  </p>
                )}
                
                <div className="mt-2 text-[11.5px] text-[#8a6a2f] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <RotateCw className="w-3 h-3" />
                  <span>{isFlipped ? 'Click to show query' : 'Click to reveal resolution'}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-line-paper text-[11px] text-[#5c5747]">
                <span className="font-mono text-[#8a8265]">ERR_NOT_FOUND</span>
                <span className="text-[11px] text-brass font-medium">ALearn Knowledge Base</span>
              </div>
            </div>

            {/* Subtle Abstract Floating Knowledge Cards behind main card */}
            <div className="absolute -bottom-3 -right-4 w-[280px] h-[160px] card-panel opacity-25 border border-line -z-10 rounded-[4px] transform rotate-3"></div>
            <div className="absolute -top-3 -left-4 w-[280px] h-[160px] card-panel opacity-15 border border-line -z-20 rounded-[4px] transform -rotate-3"></div>
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Big Editorial 404 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-soft border border-brass/30 text-brass text-xs font-semibold uppercase tracking-widest mb-1">
            <SearchX className="w-3.5 h-3.5" />
            HTTP 404 Error
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-text tracking-tight">
            Looks Like This Page Got Lost
          </h1>

          <p className="text-muted text-base sm:text-[17px] leading-relaxed max-w-lg mx-auto">
            The page you're looking for doesn't exist, may have been moved, or the URL might be incorrect. Let's get you back to learning.
          </p>
        </motion.div>

        {/* Primary & Secondary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <Link
            to={dashboardPath}
            className="w-full sm:w-auto btn-brass text-[14px] py-2.5 px-6 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Secondary Button */}
          <Link
            to={decksPath}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[3px] bg-panel hover:bg-white/5 border border-line hover:border-brass/30 text-text font-medium text-[14px] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Layers className="w-4 h-4 text-brass group-hover:scale-110 transition-transform" />
            <span>Explore Study Decks</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;
