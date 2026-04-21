import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  MousePointer2, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight,
  UserCircle,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/selection');
    }
  }, [user, navigate]);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Email Validation Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const userEmail = formRef.current.user_email.value;

    if (!emailRegex.test(userEmail)) {
      toast.error('Please enter a valid, legitimate email address.');
      setIsSending(false);
      return;
    }

    if (!serviceId || !templateId || !publicKey || serviceId.includes('here')) {
      toast.error('Contact feature is not configured yet. Please try again later.');
      setIsSending(false);
      return;
    }

    emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          toast.success('Message sent! Our support team will reach out soon.');
          formRef.current.reset();
          setIsSending(false);
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error('Failed to send message. Please try emailing directly.');
          setIsSending(false);
        },
      );
  };

  const smoothTransition = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1] // Oasis Premium Smooth
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ...smoothTransition
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: smoothTransition
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-accent-highlight/30 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[100vw] h-[600px] bg-[radial-gradient(circle_at_50%_0%,_rgba(114,74,167,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, duration: 1.5 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-on-surface mb-8 leading-[1.1]">
              Learn with your study buddy, <span className="mesh-gradient-text">ALearn</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
            className="text-lg sm:text-xl text-on-surface/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Transform your study materials into interactive flashcards and quizzes in seconds. 
            ALearn helps you focus on what matters—learning, not preparing.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...smoothTransition, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button 
              onClick={() => login()}
              className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 mesh-gradient text-white text-base sm:text-lg font-bold rounded-2xl sm:rounded-xl ambient-shadow flex items-center justify-center group hover:scale-[1.02] transition-all duration-300"
            >
              Start Studying for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-sm text-on-surface/40 font-bold uppercase tracking-widest">
              Connect with Google
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={smoothTransition}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20"
          >
            <div className="max-w-xl">
              <label className="text-xs uppercase tracking-[0.2em] text-secondary-violet font-bold mb-4 block">Core Capabilities</label>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-on-surface">Designed for Cognitive Performance</h2>
              <p className="text-lg text-on-surface/60">We’ve stripped away the noise to give you the most powerful study tools ever built, powered by advanced AI.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                title: "AI & Manual Flashcards", 
                desc: "Create flashcards manually or let our AI generate them from documents instantly.",
                icon: <FileText className="w-8 h-8 text-primary-indigo" />,
                color: "bg-primary-indigo/5"
              },
              { 
                title: "AI Quiz Generator", 
                desc: "Test your knowledge with automatically generated quizzes tailored to your content.",
                icon: <BrainCircuit className="w-8 h-8 text-secondary-violet" />,
                color: "bg-secondary-violet/5"
              },
              { 
                title: "Smart Topic Mining", 
                desc: "Enter a topic and watch the AI generate comprehensive study sets from scratch.",
                icon: <Zap className="w-8 h-8 text-accent-highlight" />,
                color: "bg-accent-highlight/5"
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="glass-card p-10 rounded-lg hover:translate-y-[-8px] transition-transform duration-500 border border-white/5"
              >
                <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-on-surface">{f.title}</h3>
                <p className="text-on-surface/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PREVIEW SECTION
      <section id="preview" className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...smoothTransition, duration: 1.5 }}
              className="relative group max-w-5xl mx-auto"
            >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-indigo/20 to-secondary-violet/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                <div className="relative glass-card p-4 rounded-xl ambient-shadow border border-white/10">
                    <div className="aspect-video w-full bg-surface-container-low rounded-[2rem] overflow-hidden flex items-center justify-center">
                        <img 
                          src="/mockup.png" 
                          alt="ALearn Dashboard Preview" 
                          className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
      </section> */}

      {/* MISSION & ABOUT SECTION */}
      <section id="about" className="py-24 bg-surface-container-low/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={smoothTransition}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-on-surface">Our Mission</h2>
              <p className="text-xl text-on-surface/60 leading-relaxed mb-8">
                Empowering students to achieve cognitive excellence through AI-driven personalization and serene design. 
                ALearn was created to bridge the gap between heavy information and deep understanding.
              </p>
              
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-primary-indigo">Master your subjects with:</h4>
                {[
                  { title: "AI Flashcards", desc: "Instantly capture core concepts from any file or lecture topic." },
                  { title: "Adaptive Quizzes", desc: "Reinforce long-term memory with challenges tailored to your mastery level." },
                  { title: "Smarter Automation", desc: "Save hours of manual entry by letting AI analyze your documents." }
                ].map((usage, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <CheckCircle2 className="w-6 h-6 text-secondary-violet mt-1" />
                    <div>
                      <span className="font-bold block text-on-surface">{usage.title}</span>
                      <span className="text-on-surface/60">{usage.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={smoothTransition}
              className="glass-card p-8 sm:p-10 rounded-2xl ambient-shadow border border-white/5"
            >
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Leave a Message</h3>
              <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold opacity-40 uppercase tracking-widest mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="user_name" 
                    required 
                    className="w-full bg-white dark:bg-slate-900/50 rounded-md p-4 border border-outline-ghost focus:border-primary-indigo outline-none transition-all text-on-surface" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-40 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="user_email" 
                    required 
                    className="w-full bg-white dark:bg-slate-900/50 rounded-md p-4 border border-outline-ghost focus:border-primary-indigo outline-none transition-all text-on-surface" 
                    placeholder="Alearn@gmail.com" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-40 uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    name="message" 
                    required 
                    className="w-full bg-white dark:bg-slate-900/50 rounded-md p-4 border border-outline-ghost focus:border-primary-indigo outline-none transition-all text-on-surface h-32 resize-none" 
                    placeholder="What's on your mind?" 
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSending} 
                  className="w-full py-4 mesh-gradient text-white font-bold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <span className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-outline-ghost">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 mesh-gradient rounded-lg flex items-center justify-center text-white shrink-0">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Direct Support</div>
                    <div className="text-primary-indigo dark:text-accent-highlight font-bold lg:text-lg break-all">flashcardsalearn@gmail.com</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LEGAL SECTION */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={smoothTransition}
              className="glass-card p-10 rounded-2xl border border-white/5"
            >
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Privacy Policy</h3>
              <div className="text-sm text-on-surface/60 space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <p>Your privacy is our priority. We only collect the data necessary to provide you with secure study materials and a personalized dashboard.</p>
                <p><strong>1. Data Collection:</strong> We use Google OAuth to securely sign you in. We do not store your Google password.</p>
                <p><strong>2. Your Content:</strong> Files uploaded for AI generation are processed securely and deleted after extraction.</p>
                <p><strong>3. Storage:</strong> Your generated flashcards and quizzes are saved to your account for your private use only.</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="glass-card p-10 rounded-2xl border border-white/5"
            >
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Terms of Service</h3>
              <div className="text-sm text-on-surface/60 space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <p>By using ALearn, you agree to focus on your education and use our AI tools responsibly.</p>
                <p><strong>1. Account Use:</strong> You are responsible for maintaining the security of your account sign-in.</p>
                <p><strong>2. Tool Usage:</strong> Our AI tools are designed to assist study, not to replace original critical thinking.</p>
                <p><strong>3. Forbidden Conduct:</strong> Users must not attempt to bypass security or scrape our AI generation engines.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-surface-container-low border-t border-outline-ghost">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 text-2xl font-bold text-on-surface mb-6">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <span>ALearn</span>
              </div>
              <p className="text-on-surface/60 max-w-sm">
                Empowering students to achieve cognitive excellence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:gap-24">
              <div>
                <h5 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-40">Product</h5>
                <ul className="space-y-4 text-on-surface/60 font-bold">
                  <li><a href="#features" className="hover:text-primary-indigo transition">Features</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-40">Support</h5>
                <ul className="space-y-4 text-on-surface/60 font-bold">
                  <li><a href="#about" className="hover:text-primary-indigo transition">Mission</a></li>
                  <li><a href="#about" className="hover:text-primary-indigo transition">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-ghost flex flex-col md:flex-row justify-between items-center text-sm text-on-surface/40">
            <p>© 2026 ALearn Study Buddy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#about">Privacy Policy</a>
              <a href="#about">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
