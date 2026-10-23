import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  Scale,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DEALERSHIP } from '../../config/dealership';
import { CommandSearch } from './CommandSearch';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const {
    cartItems,
    compareIds,
    favoriteIds,
    setIsCartOpen,
    openTestDrive,
    theme,
    toggleTheme,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent over hero top 80px
      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down past 120px, reveal on scroll up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > 6) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Inventory', path: '/inventory' },
    { label: 'Compare', path: '/compare' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Blog', path: '/blog' },
    { label: 'Financing', path: '/financing' },
    { label: 'About', path: '/about' },
  ];

  const totalCartCount = cartItems.length;
  const compareCount = compareIds.length;
  const favoriteCount = favoriteIds.length;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-[#0A0B0F]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3.5'
            : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Zone 1: Brand Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-white group whitespace-nowrap shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF4D2E] via-[#FF8A00] to-[#FFC14D] flex items-center justify-center shadow-lg shadow-[#FF4D2E]/20 transition-transform group-hover:scale-105">
                <div className="w-2.5 h-2.5 bg-[#0A0B0F] rotate-45 transform" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-['Archivo']">
                {DEALERSHIP.name}
              </span>
            </Link>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 text-sm font-semibold tracking-wide transition-colors ${
                      isActive ? 'text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {/* Animated hover underline drawing left to right */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF4D2E] to-[#FFC14D] transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Actions & Affordances */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Quick Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Search Inventory (Cmd+K)"
                title="Search (Cmd+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites with count badge */}
              <Link
                to="/inventory?saved=true"
                className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Saved vehicles"
                title="Saved vehicles"
              >
                <Heart className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF4D2E] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* Compare with count badge */}
              <Link
                to="/compare"
                className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Compare vehicles"
                title="Compare vehicles"
              >
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Reservation Cart with animated badge bump */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Reservation Cart"
                title="Reservation Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <motion.span
                    key={totalCartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#22C55E] text-white text-[10px] font-bold flex items-center justify-center font-mono"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle Theme"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Book a Test Drive CTA */}
              <button
                onClick={() => openTestDrive()}
                className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-lg shadow-[#FF4D2E]/25 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Book Test Drive
              </button>

              {/* Mobile Hamburger Morph */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Thin bottom border with subtle Ignition gradient line */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4D2E]/40 to-transparent pointer-events-none" />
        )}
      </header>

      {/* Command Search Overlay */}
      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Full-Screen Menu with Staggered Links */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 pt-24 px-6 pb-8 bg-[#0A0B0F]/98 backdrop-blur-2xl flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-5">
              <span className="text-xs uppercase tracking-widest text-[#71717A] font-semibold">
                Menu Navigation
              </span>

              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center justify-between text-2xl font-black text-white hover:text-[#FF8A00] tracking-tight transition-colors py-1"
                  >
                    <span>{link.label}</span>
                    {link.label === 'Compare' && compareCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#3B82F6] text-white font-mono">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-4 border-t border-white/10 flex flex-col gap-3"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openTestDrive();
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition text-center shadow-lg shadow-[#FF4D2E]/25"
                >
                  Book a Test Drive
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-white/5 border border-white/10 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#22C55E]" />
                  <span>View Reservation Cart ({totalCartCount})</span>
                </button>
              </motion.div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-2 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF8A00]" />
                <a href={`tel:${DEALERSHIP.phone}`} className="hover:text-white">
                  {DEALERSHIP.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                <span>Dallas, TX · 150-Point Certified</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
