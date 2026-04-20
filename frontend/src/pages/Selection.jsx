import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  PlusCircle, 
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Selection = () => {
  const { user } = useAuth();

  const options = [
    {
      title: "Study Dashboard",
      desc: "View your personal study deck and track progress.",
      icon: <LayoutDashboard className="w-8 h-8 text-primary-indigo" />,
      path: "/dashboard",
      color: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-blue-500/20"
    },
    {
      title: "AI Generator",
      desc: "Convert text or topics into interactive flashcards.",
      icon: <Sparkles className="w-8 h-8 text-secondary-violet" />,
      path: "/ai-generator",
      color: "from-purple-500/10 to-violet-500/10",
      iconBg: "bg-purple-500/20"
    },
    {
      title: "Quiz Master",
      desc: "Challenge yourself with AI-generated tests.",
      icon: <BrainCircuit className="w-8 h-8 text-green-500" />,
      path: "/quiz",
      color: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/20"
    },
    {
      title: "Quick Add",
      desc: "Manually create flashcards for specific concepts.",
      icon: <PlusCircle className="w-8 h-8 text-orange-500" />,
      path: "/manual",
      color: "from-orange-500/10 to-yellow-500/10",
      iconBg: "bg-orange-500/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="max-w-4xl w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Welcome back, <span className="mesh-gradient-text">{user?.name?.split(' ')[0] || 'Scholar'}</span>
          </h1>
          <p className="text-lg text-on-surface/60">What tool do you need for your sanctuary today?</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {options.map((opt, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link 
                to={opt.path}
                className={`group block relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] glass-card hover:border-primary-indigo/40 transition-all duration-500 ambient-shadow overflow-hidden h-full [transform:translateZ(0)]`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                <div className="relative z-10 flex items-start space-x-6">
                  <div className={`shrink-0 w-16 h-16 rounded-2xl ${opt.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-white/20`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-on-surface mb-2 flex items-center group-hover:text-primary-indigo transition-colors duration-300">
                      {opt.title}
                      <ArrowRight className="ml-2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-on-surface/60 leading-relaxed font-medium">{opt.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Selection;
