import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, Search, LogIn, UserPlus, LogOut, LayoutDashboard, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className={`relative group flex items-center space-x-2 py-2 px-1 text-sm font-bold transition-all duration-300 ${
        isActive(to) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive(to) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
      <span>{children}</span>
      {isActive(to) && (
        <motion.div 
          layoutId="activeNav"
          className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-600 rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gray-100' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-2 shadow-sm border border-gray-100 md:bg-transparent md:rounded-none md:px-0 md:py-0 md:shadow-none md:border-none">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-tight">EduFund</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest -mt-1">Scholarship Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavItem to="/" icon={Home}>Home</NavItem>
            <NavItem to="/scholarships" icon={Search}>Scholarships</NavItem>
            
            {user ? (
              <div className="flex items-center space-x-6 pl-6 border-l border-gray-100">
                <NavItem to={user.role === 'admin' ? '/admin' : '/dashboard'} icon={LayoutDashboard}>Dashboard</NavItem>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-red-500 transition-colors py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
                <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{user.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-100">
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-gray-600 hover:text-blue-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Join Program</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl p-8 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-xl">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-gray-900">EduFund</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-8 w-8 text-gray-400" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 flex items-center gap-4">
                    <Home className="h-6 w-6 text-blue-600" /> Home
                  </Link>
                  <Link to="/scholarships" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 flex items-center gap-4">
                    <Search className="h-6 w-6 text-blue-600" /> Scholarships
                  </Link>
                  {user && (
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-900 flex items-center gap-4">
                      <LayoutDashboard className="h-6 w-6 text-blue-600" /> Dashboard
                    </Link>
                  )}
                </nav>

                <div className="mt-auto pt-8 border-t border-gray-100">
                  {user ? (
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 p-4 rounded-xl font-bold transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout Account</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center p-4 text-gray-600 font-bold">
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

