import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  PlusCircle, 
  Sparkles, 
  BrainCircuit, 
  UserCircle, 
  FileText, 
  LayoutDashboard,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
    { name: 'Manual', path: '/manual', icon: <PlusCircle className="w-5 h-5 mr-2" /> },
    { name: 'AI Generator', path: '/ai-generator', icon: <Sparkles className="w-5 h-5 mr-2" /> },
    { name: 'Quiz', path: '/quiz', icon: <BrainCircuit className="w-5 h-5 mr-2" /> },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    toast.success('Successfully logged out. See you soon, Scholar!');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pointer-events-none px-4 py-4">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div className="glass-card rounded-2xl h-16 px-5 sm:px-8 flex justify-between items-center ambient-shadow border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-8">
              <Link to="/" onClick={closeMenu} className="flex items-center group">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-500 bg-white p-1">
                  <img src="/logo.png" alt="ALearn Logo" className="w-full h-full object-contain" />
                </div>
                <span className="ml-3 text-xl font-bold tracking-tight text-on-surface">ALearn</span>
              </Link>
              
              {user && (
                <div className="hidden lg:flex items-center space-x-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center ${
                          isActive
                            ? 'bg-primary-indigo/10 text-primary-indigo dark:text-indigo-400'
                            : 'text-on-surface/50 dark:text-gray-400 hover:text-on-surface dark:hover:text-gray-200 hover:bg-surface-container-low dark:hover:bg-slate-800'
                        }`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4 pl-4 border-l border-outline-ghost">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-xs font-bold text-on-surface uppercase tracking-widest">{user.name}</span>
                      <span className="text-[10px] text-on-surface/40">Premium Scholar</span>
                    </div>
                    <img 
                      className="h-10 w-10 rounded-full bg-surface-container-highest ambient-shadow ring-2 ring-white object-cover" 
                      src={user.avatar} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={toggleTheme} 
                      className="p-2 rounded-xl hover:bg-surface-container-low dark:hover:bg-slate-800 text-on-surface dark:text-white transition-colors duration-300"
                      title="Toggle Theme"
                    >
                      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={() => setShowLogoutModal(true)} 
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-500 transition-colors duration-300"
                      title="Sign Out"
                    >
                      <UserCircle className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center space-x-6 mr-4 text-sm font-bold text-on-surface/60 uppercase tracking-widest">
                      <a href="#features" className="hover:text-primary-indigo transition">Features</a>
                      <a href="#about" className="hover:text-primary-indigo transition">About</a>
                    </div>
                    <button 
                      onClick={toggleTheme} 
                      className="p-2 rounded-xl hover:bg-surface-container-low dark:hover:bg-slate-800 text-on-surface dark:text-white transition-colors duration-300"
                      title="Toggle Theme"
                    >
                      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={() => login()}
                      className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white mesh-gradient shadow-lg hover:scale-105 transition-all duration-300 ambient-shadow"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden mt-4 animate-slide-up">
              <div className="glass-card rounded-[2.5rem] p-6 shadow-2xl flex flex-col space-y-4 border border-white/20 dark:border-white/10">
                {user ? (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-outline-ghost mb-2">
                       <div className="flex items-center space-x-4">
                        {user.avatar ? (
                          <img 
                            className="h-12 w-12 rounded-full ring-2 ring-primary-indigo/20 object-cover" 
                            src={user.avatar} 
                            alt={user.name} 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary-indigo/10 flex items-center justify-center text-primary-indigo">
                            <UserCircle className="w-8 h-8" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-on-surface">{user.name}</div>
                          <div className="text-xs text-on-surface/40 uppercase tracking-widest">Premium Scholar</div>
                        </div>
                      </div>
                      <button 
                        onClick={toggleTheme} 
                        className="p-3 rounded-2xl bg-surface-container-low text-on-surface transition-colors"
                      >
                        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                      </button>
                    </div>
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={closeMenu}
                        className="flex items-center p-3 rounded-xl hover:bg-surface-container-low transition-colors"
                      >
                        <div className="p-2 bg-primary-indigo/5 rounded-lg mr-4 text-primary-indigo">
                          {link.icon}
                        </div>
                        <span className="font-semibold text-on-surface">{link.name}</span>
                      </Link>
                    ))}
                    <button 
                      onClick={() => { setShowLogoutModal(true); closeMenu(); }}
                      className="flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <div className="p-2 bg-red-100/50 rounded-lg mr-4">
                        <UserCircle className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      <a href="#features" onClick={closeMenu} className="p-4 rounded-xl hover:bg-surface-container-low font-bold text-on-surface/60 uppercase tracking-widest text-center">Features</a>
                      <a href="#preview" onClick={closeMenu} className="p-4 rounded-xl hover:bg-surface-container-low font-bold text-on-surface/60 uppercase tracking-widest text-center">Preview</a>
                      <a href="#about" onClick={closeMenu} className="p-4 rounded-xl hover:bg-surface-container-low font-bold text-on-surface/60 uppercase tracking-widest text-center">About</a>
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <button 
                        onClick={toggleTheme}
                        className="p-4 rounded-2xl bg-surface-container-low text-on-surface flex items-center justify-center shrink-0"
                        title="Toggle Theme"
                      >
                        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                      </button>
                      <button 
                        onClick={() => { login(); closeMenu(); }}
                        className="flex-1 py-4 rounded-2xl text-white font-bold mesh-gradient shadow-lg ambient-shadow flex items-center justify-center"
                      >
                        Sign In with Google
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] ambient-shadow border border-white/50 text-center animate-slide-up">
            <div className="w-20 h-20 mesh-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-on-surface">Ready to leave the ALearn?</h3>
            <p className="text-on-surface/60 mb-10 leading-relaxed">
              We'll miss you, but we'll have your progress and flashcards safe for when you return!
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all duration-300 ambient-shadow"
              >
                Yes, Sign Out
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-4 bg-surface-container-low text-on-surface font-bold rounded-2xl hover:bg-surface-container-high transition-all duration-300"
              >
                No, Keep Studying
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
