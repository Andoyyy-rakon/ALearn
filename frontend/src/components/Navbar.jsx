import { Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  Brain, 
  UserCircle, 
  FileText, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Manual', path: '/manual', icon: <PlusCircle className="w-4 h-4 mr-2" /> },
    { name: 'AI Generator', path: '/ai-generator', icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: 'Quiz', path: '/quiz', icon: <Brain className="w-4 h-4 mr-2" /> },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    toast.success('Successfully logged out. See you soon, Scholar!');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-md border-b border-line">
        <div className="wrap">
          <div className="h-16 flex justify-between items-center">
            
            {/* Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-[4px_4px_4px_0] bg-brass-soft border border-brass flex items-center justify-center font-serif font-semibold text-brass text-[17px]">
                  A
                </div>
                <span className="font-serif text-[19px] text-text tracking-[0.2px]">ALearn</span>
              </Link>
              
              {user && (
                <div className="hidden lg:flex items-center space-x-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`px-3 py-1.5 rounded-[3px] text-[13px] font-medium transition-colors duration-150 flex items-center ${
                          isActive
                            ? 'bg-brass-soft text-brass font-semibold'
                            : 'text-muted hover:text-text hover:bg-white/5'
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

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3 pl-4 border-l border-line">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-semibold text-text tracking-tight">{user.name}</span>
                      <span className="text-[10px] text-muted font-medium">Scholar</span>
                    </div>
                    <img 
                      className="h-8 w-8 rounded-full border border-line object-cover" 
                      src={user.avatar} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => setShowLogoutModal(true)} 
                      className="p-1.5 rounded-[3px] hover:bg-white/5 text-muted hover:text-rust transition-colors duration-150"
                      title="Sign Out"
                    >
                      <UserCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center space-x-6 mr-2 text-[13px] font-medium text-muted">
                      <a href="#features" className="hover:text-brass transition-colors duration-150">Features</a>
                      <a href="#about" className="hover:text-brass transition-colors duration-150">Mission</a>
                      <a href="#contact" className="hover:text-brass transition-colors duration-150">Contact</a>
                    </div>
                    <button 
                      onClick={() => login()}
                      className="btn-brass text-[13px] py-1.5 px-4"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col gap-[5px] p-1.5 cursor-pointer"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-muted" />
                ) : (
                  <>
                    <span className="w-5 h-[1.5px] bg-muted block"></span>
                    <span className="w-5 h-[1.5px] bg-muted block"></span>
                    <span className="w-5 h-[1.5px] bg-muted block"></span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-line bg-panel/95 backdrop-blur-lg px-6 py-5 space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img className="h-9 w-9 rounded-full border border-line object-cover" src={user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-brass-soft flex items-center justify-center text-brass">
                        <UserCircle className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-text">{user.name}</div>
                      <div className="text-[10px] text-muted font-medium">Scholar</div>
                    </div>
                  </div>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMenu}
                    className="flex items-center p-2 rounded-[3px] hover:bg-white/5 transition-colors text-sm font-medium text-text"
                  >
                    <div className="mr-3 text-brass">{link.icon}</div>
                    <span>{link.name}</span>
                  </Link>
                ))}
                <button 
                  onClick={() => { setShowLogoutModal(true); closeMenu(); }}
                  className="w-full flex items-center p-2 rounded-[3px] text-rust hover:bg-rust/10 transition-colors text-sm font-medium"
                >
                  <UserCircle className="w-4 h-4 mr-3" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col space-y-1 pb-3">
                  <a href="#features" onClick={closeMenu} className="p-2 rounded-[3px] hover:bg-white/5 text-sm font-medium text-muted hover:text-text">Features</a>
                  <a href="#about" onClick={closeMenu} className="p-2 rounded-[3px] hover:bg-white/5 text-sm font-medium text-muted hover:text-text">Mission</a>
                  <a href="#contact" onClick={closeMenu} className="p-2 rounded-[3px] hover:bg-white/5 text-sm font-medium text-muted hover:text-text">Contact</a>
                </div>
                <button 
                  onClick={() => { login(); closeMenu(); }}
                  className="w-full btn-brass text-sm py-2 px-4"
                >
                  Sign In with Google
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="card-panel w-full max-w-sm p-8 text-center ambient-shadow">
            <div className="w-11 h-11 bg-rust/15 text-rust rounded-[4px] flex items-center justify-center mx-auto mb-5">
              <UserCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2 text-text">Sign Out of ALearn?</h3>
            <p className="text-[13px] text-muted mb-6 leading-relaxed">
              Your study decks, flashcards, and progress will be safely saved when you return.
            </p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-rust hover:bg-rust/90 text-white font-semibold text-[13px] rounded-[3px] transition-colors"
              >
                Sign Out
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2 bg-white/5 hover:bg-white/8 text-muted font-semibold text-[13px] rounded-[3px] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
