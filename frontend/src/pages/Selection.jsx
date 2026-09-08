import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Brain, 
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
      icon: <LayoutDashboard className="w-7 h-7" />,
      path: "/dashboard",
      accent: "text-brass",
      iconBg: "bg-brass-soft"
    },
    {
      title: "AI Generator",
      desc: "Convert topics into interactive flashcards.",
      icon: <FileText className="w-7 h-7" />,
      path: "/ai-generator",
      accent: "text-sage",
      iconBg: "bg-sage/15"
    },
    {
      title: "Quiz Master",
      desc: "Challenge yourself with AI-generated tests.",
      icon: <Brain className="w-7 h-7" />,
      path: "/quiz",
      accent: "text-brass",
      iconBg: "bg-brass-soft"
    },
    {
      title: "Quick Add",
      desc: "Manually create flashcards for specific concepts.",
      icon: <PlusCircle className="w-7 h-7" />,
      path: "/manual",
      accent: "text-rust",
      iconBg: "bg-rust/15"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
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
          <h1 className="font-serif text-4xl sm:text-5xl text-text mb-4">
            Welcome back, <span className="text-brass">{user?.name?.split(' ')[0] || 'Scholar'}</span>
          </h1>
          <p className="text-lg text-muted">What tool do you need for your sanctuary today?</p>
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
                className="group block relative p-6 sm:p-8 card-panel hover:border-brass/30 transition-all duration-300 h-full"
              >
                <div className="relative z-10 flex items-start space-x-5">
                  <div className={`shrink-0 w-14 h-14 rounded-[4px] ${opt.iconBg} ${opt.accent} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-medium text-text mb-2 flex items-center group-hover:text-brass transition-colors duration-300">
                      {opt.title}
                      <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-muted text-[14px] leading-relaxed">{opt.desc}</p>
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
