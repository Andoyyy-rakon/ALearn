import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  UserCircle,
  Send,
  RotateCw,
  BookOpen,
  BarChart3,
  FileText,
  Brain,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

const HERO_DECK = [
  {
    id: 1,
    topic: "Cognitive Neuroscience",
    difficulty: "Easy",
    difficultyDot: "dot-mastered",
    difficultyLabel: "text-sage",
    question: "What is the primary role of the hippocampus in human memory formation?",
    answer: "It consolidates new experiences into long-term memory and helps encode spatial and contextual detail before that information is stored more broadly across the cortex.",
    deckName: "Study Deck"
  },
  {
    id: 2,
    topic: "Quantum Physics",
    difficulty: "Medium",
    difficultyDot: "bg-brass",
    difficultyLabel: "text-brass",
    question: "What does Heisenberg's Uncertainty Principle fundamentally state?",
    answer: "It asserts that one cannot simultaneously determine with arbitrary precision both the exact position and linear momentum of a quantum particle.",
    deckName: "Physics Deck"
  },
  {
    id: 3,
    topic: "Organic Chemistry",
    difficulty: "Hard",
    difficultyDot: "dot-review",
    difficultyLabel: "text-rust",
    question: "What defines an electrophilic addition reaction in alkenes?",
    answer: "An electron-deficient species (electrophile) attacks the double bond carbon-carbon pi electrons, breaking the pi bond to form two new sigma bonds.",
    deckName: "Chemistry Deck"
  },
  {
    id: 4,
    topic: "Macroeconomics",
    difficulty: "Medium",
    difficultyDot: "bg-brass",
    difficultyLabel: "text-brass",
    question: "What is the Fisher Effect in monetary theory?",
    answer: "It describes the one-for-one relationship between the expected inflation rate and nominal interest rates, keeping the real interest rate constant in equilibrium.",
    deckName: "Economics Deck"
  }
];

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);

  // Stacked Carousel State
  const [deck, setDeck] = useState(HERO_DECK);
  const [revealed, setRevealed] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/selection');
    }
  }, [user, navigate]);

  const nextCard = () => {
    setRevealed(false);
    setDeck(prevDeck => {
      const newDeck = [...prevDeck];
      const topCard = newDeck.shift();
      newDeck.push(topCard);
      return newDeck;
    });
  };

  const prevCard = () => {
    setRevealed(false);
    setDeck(prevDeck => {
      const newDeck = [...prevDeck];
      const lastCard = newDeck.pop();
      newDeck.unshift(lastCard);
      return newDeck;
    });
  };

  const toggleFlip = () => setRevealed(!revealed);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  };

  const activeCard = deck[0];

  return (
    <div className="min-h-screen overflow-x-hidden">
      
      {/* ═══════════ HERO ═══════════ */}
      <section className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-20 lg:pt-24 pb-24 lg:pb-28 items-center">
          
          {/* Hero Copy */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
          >
            <h1 className="font-serif text-[clamp(34px,4.2vw,50px)] leading-[1.12] tracking-[-0.01em] max-w-[16ch] mb-5">
              Turn any subject into something you actually remember
            </h1>
            <p className="text-muted text-[16.5px] leading-[1.65] max-w-[46ch] mb-8">
              Hand ALearn a topic or a set of notes. It comes back with flashcards and quizzes built to make the material stick — so study time goes toward understanding, not formatting.
            </p>
            <button 
              onClick={() => login()}
              className="btn-brass group py-2 px-5 text-[14px]"
            >
              Start studying for free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-y-3 mt-9 pt-5 border-t border-line">
              {[
                'Zero setup',
                'Interactive flashcards',
                'Adaptive tests'
              ].map((feat, i) => (
                <div key={i} className={`flex items-center gap-2 text-[13.5px] text-muted ${i < 2 ? 'pr-6 mr-6 border-r border-line' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5L5.5 11L12 3" stroke="#6FA287" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {feat}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Stacked Card Carousel Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
            className="flex flex-col items-center justify-center relative py-6"
          >
            {/* Stack Container */}
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {deck.slice(0, 3).map((card, index) => {
                  const isTop = index === 0;
                  // Perfectly stacked cards with identical sizing (scale: 1) and crisp alignment
                  const offsets = [
                    { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
                    { x: 8, y: 10, scale: 1, rotate: 0, zIndex: 20, opacity: 0.85 },
                    { x: 16, y: 20, scale: 1, rotate: 0, zIndex: 10, opacity: 0.6 }
                  ];
                  const style = offsets[index];

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ scale: 1, opacity: 0, y: 40 }}
                      animate={{
                        x: style.x,
                        y: style.y,
                        scale: style.scale,
                        rotate: style.rotate,
                        opacity: style.opacity,
                        zIndex: style.zIndex,
                      }}
                      exit={{
                        x: 220,
                        rotate: 15,
                        opacity: 0,
                        scale: 1,
                        transition: { duration: 0.35, ease: 'easeIn' }
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      onClick={isTop ? toggleFlip : undefined}
                      className={`absolute top-0 left-0 card-paper w-[340px] h-[310px] p-6 flex flex-col justify-between ${isTop ? 'cursor-pointer shadow-2xl' : 'pointer-events-none'}`}
                    >
                      {/* Tape strip */}
                      <div className="absolute top-0 left-7 w-[34px] h-[10px] bg-paper rounded-b-[4px] shadow-[0_1px_0_rgba(0,0,0,0.06)] -translate-y-[9px]"></div>
                      
                      <div className="flex justify-between items-center pb-3.5 mb-0 border-b border-line-paper text-[12.5px] text-[#5c5747]">
                        <span className="font-serif text-[15px] text-paper-ink">{card.topic}</span>
                        <span>
                          <span className={`${card.difficultyLabel} font-medium`}>{card.difficulty}</span> · {card.id}/{HERO_DECK.length}
                        </span>
                      </div>

                      <div className="py-2 text-center flex-grow flex flex-col justify-center gap-3">
                        <div className="text-[11.5px] text-[#8a8265] tracking-[0.02em]">
                          {isTop && revealed ? 'Answer' : `Question ${card.id}`}
                        </div>
                        {isTop && revealed ? (
                          <p className="text-[13.5px] leading-[1.55] text-[#4a4636] overflow-y-auto max-h-[120px]">{card.answer}</p>
                        ) : (
                          <p className="font-serif text-[16.5px] leading-[1.4] text-paper-ink overflow-y-auto max-h-[120px]">{card.question}</p>
                        )}
                        
                        {isTop && (
                          <button 
                            className="text-[13px] text-[#8a6a2f] hover:text-paper-ink flex items-center gap-1.5 justify-center mx-auto transition-colors mt-1"
                            onClick={(e) => { e.stopPropagation(); toggleFlip(); }}
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            {revealed ? 'Back to question' : 'Click to reveal answer'}
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-line-paper text-[12.5px]">
                        <span className="text-[#5c5747]">{card.deckName}</span>
                        <div className="flex gap-3.5">
                          <span className="flex items-center gap-1.5"><span className={card.difficultyDot}></span>Mastered</span>
                          <span className="flex items-center gap-1.5"><span className="dot-review"></span>Review</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Stacked Controls & Indicators */}
            <div className="flex items-center gap-4 mt-6 z-40">
              <button 
                onClick={prevCard} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text border border-line transition-colors"
                title="Previous Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5 text-[13px] text-muted font-medium px-3 py-1 rounded-full bg-panel border border-line">
                <Layers className="w-3.5 h-3.5 text-brass mr-1" />
                <span className="text-text font-semibold">{activeCard.id}</span> / {HERO_DECK.length}
              </div>

              <button 
                onClick={nextCard} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text border border-line transition-colors"
                title="Next Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════ CORE CAPABILITIES ═══════════ */}
      <section id="features" className="py-20 lg:py-28 border-y border-line bg-panel/40">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={smoothTransition}
            className="max-w-2xl mb-14"
          >
            <span className="text-[11px] uppercase tracking-widest text-brass font-semibold mb-3 block">
              Core Capabilities
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-text mb-4 tracking-tight">
              Designed for Cognitive Performance
            </h2>
            <p className="text-[15px] text-muted leading-relaxed">
              We've built focused, streamlined tools designed to accelerate active recall and long-term retention without visual noise.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={smoothTransition}
              className="lg:col-span-7 card-panel p-8 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-[4px] bg-brass-soft flex items-center justify-center mb-6 text-brass">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-[22px] font-medium mb-3 text-text">AI & Manual Flashcard Studio</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-6">
                  Extract core concepts automatically from lecture topics and text, or craft custom decks manually with rich formatting controls.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-line text-[13px]">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-text">Topic Concept Mining</span>
                    <span className="text-muted text-[12px]">Instant AI study creation</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-text">Custom Card Builder</span>
                    <span className="text-muted text-[12px]">Full editorial control</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Cards */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...smoothTransition, delay: 0.1 }}
                className="card-panel p-6"
              >
                <div className="w-9 h-9 rounded-[4px] bg-brass-soft flex items-center justify-center mb-4 text-brass">
                  <Brain className="w-[18px] h-[18px]" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-text">Adaptive AI Quiz Generator</h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  Evaluate your recall strength with dynamically generated multiple-choice quizzes created straight from your deck topics.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...smoothTransition, delay: 0.2 }}
                className="card-panel p-6"
              >
                <div className="w-9 h-9 rounded-[4px] bg-brass-soft flex items-center justify-center mb-4 text-brass">
                  <Lightbulb className="w-[18px] h-[18px]" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-text">Instant Topic Mining</h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  Simply enter any academic topic or key term, and ALearn will generate a structured study deck in seconds.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OUR MISSION ═══════════ */}
      <section id="about" className="py-20 lg:py-28 scroll-mt-16">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Mission Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={smoothTransition}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[3px] bg-white/5 text-[12px] font-semibold text-muted border border-line">
                <span>Our Purpose</span>
              </div>
              <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-text leading-tight tracking-tight">
                Empowering scholars through intentional design
              </h2>
              <p className="text-[15px] text-muted leading-relaxed">
                ALearn was created to eliminate the universal friction in studying: spending hours organizing materials instead of mastering them. We bridge the gap between dense subjects and deep understanding.
              </p>
              
              <div className="space-y-4 pt-2">
                {[
                  { title: "Instant AI Synthesis", desc: "Convert subjects and terms into structured recall cards without manual entry." },
                  { title: "Scientifically Proven Spacing", desc: "Reinforce long-term memory through structured active recall testing." },
                  { title: "Zero Visual Noise", desc: "A restrained, calm interface designed to keep your attention on study material." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5">
                    <div className="p-1 rounded-[3px] bg-brass-soft text-brass mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-text">{item.title}</h4>
                      <p className="text-[13px] text-muted leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
           
            {/* Cognitive Science Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="lg:col-span-6 card-panel p-6 sm:p-8 space-y-6 ambient-shadow"
            >
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-text">
                  <BarChart3 className="w-4 h-4 text-brass" />
                  <span>Cognitive Recall Efficiency</span>
                </div>
                <span className="text-[11px] text-muted font-medium">Memory Retention Study</span>
              </div>

              <div className="space-y-4 text-[13px]">
                <div>
                  <div className="flex justify-between font-medium mb-1.5 text-muted">
                    <span>Passive Rereading</span>
                    <span>~15% Retention</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-muted/50 rounded-full w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1.5 text-brass">
                    <span>Active Recall + AI Decks (ALearn)</span>
                    <span className="font-semibold">~92% Retention</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-brass rounded-full w-[92%]" />
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-muted pt-2 border-t border-line leading-relaxed">
                Active testing forces memory retrieval, building stronger neural pathways than passive highlights or re-reading text.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT FORM ═══════════ */}
      <section id="contact" className="py-20 lg:py-28 border-t border-line bg-panel/40 scroll-mt-16">
        <div className="wrap">
          <div className="max-w-[520px] mx-auto card-panel p-10 sm:p-11 ambient-shadow">
            
            <div className="text-center mb-8">
              <h2 className="font-serif text-[26px] text-text mb-3">Leave a message</h2>
              <p className="text-muted text-[14.5px] leading-[1.6] max-w-[38ch] mx-auto">
                Have feedback or questions? Send us a message and our support team will respond promptly.
              </p>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              <div>
                <label className="block text-[12.5px] text-muted mb-2">Your name</label>
                <input type="text" name="user_name" required className="field-underline" placeholder="Andres Reyes" />
              </div>
              <div>
                <label className="block text-[12.5px] text-muted mb-2">Email address</label>
                <input type="email" name="user_email" required className="field-underline" placeholder="andresreyes@gmail.com" />
              </div>
              <div>
                <label className="block text-[12.5px] text-muted mb-2">Message</label>
                <textarea name="message" required rows="4" className="field-underline" placeholder="How can we help your study workflow?"></textarea>
              </div>
              <button type="submit" disabled={isSending} className="w-full btn-brass text-[14.5px] mt-1 py-2 px-4">
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Sending Message...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </span>
                )}
              </button>
            </form>
            
            <div className="flex items-center gap-2.5 mt-7 pt-5 border-t border-line text-[13px] text-muted">
              <span>Direct support:</span>
              <a href="mailto:flashcardsalearn@gmail.com" className="text-brass hover:underline">flashcardsalearn@gmail.com</a>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════ LEGAL POLICIES ═══════════ */}
      <section className="py-16">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={smoothTransition}
              className="card-panel p-6 sm:p-8"
            >
              <h3 className="font-serif text-base font-medium mb-3 text-text">Privacy Policy</h3>
              <div className="text-[13px] text-muted space-y-3 max-h-[200px] overflow-y-auto pr-3 leading-relaxed">
                <p>Your privacy is fundamental to our product philosophy. We only handle data essential to delivering your personalized study decks and progress history.</p>
                <p><strong className="text-text">1. Authentication:</strong> We utilize Google OAuth for secure sign-in. Your account credentials and passwords are never stored on our servers.</p>
                <p><strong className="text-text">2. Account Security:</strong> All created flashcards, quizzes, and personal deck collections remain tied to your account for your private study use only.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...smoothTransition, delay: 0.1 }}
              className="card-panel p-6 sm:p-8"
            >
              <h3 className="font-serif text-base font-medium mb-3 text-text">Terms of Service</h3>
              <div className="text-[13px] text-muted space-y-3 max-h-[200px] overflow-y-auto pr-3 leading-relaxed">
                <p>By using the ALearn platform, you agree to leverage our learning tools responsibly in support of your personal academic growth.</p>
                <p><strong className="text-text">1. Account Responsibilities:</strong> You remain responsible for maintaining access to your authorized Google login.</p>
                <p><strong className="text-text">2. Tool Intent:</strong> Our AI generation features are designed as learning aids to assist study, active recall, and comprehension.</p>
                <p><strong className="text-text">3. Fair Conduct:</strong> Users must not attempt to compromise application security, execute automated scraping, or overload the generation backend.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-line py-11">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 pb-7">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-7 h-7 rounded-[4px_4px_4px_0] bg-brass-soft border border-brass flex items-center justify-center font-serif text-[13px] font-semibold text-brass">A</div>
                <span className="font-serif text-[16px] text-text">ALearn Study Buddy</span>
              </div>
              <p className="text-muted text-[13.5px] max-w-[32ch]">Empowering scholars with intelligent active recall tools.</p>
            </div>
            <div className="flex items-center gap-6 text-[14px]">
              <a href="#features" className="text-text hover:text-brass transition-colors">Features</a>
              <a href="#about" className="text-text hover:text-brass transition-colors">Mission</a>
              <a href="#contact" className="text-text hover:text-brass transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-line pt-5 flex flex-col sm:flex-row justify-between items-center text-[12.5px] text-muted gap-2">
            <span>© 2026 ALearn Study Buddy. All rights reserved.</span>
            <span>
              <a href="#" className="hover:text-brass transition-colors ml-0 sm:ml-4">Privacy policy</a>
              <a href="#" className="hover:text-brass transition-colors ml-4">Terms of service</a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
