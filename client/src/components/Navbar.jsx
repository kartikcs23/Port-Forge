import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';
import { useAppUser } from '../hooks/useAppUser';

export const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useAppUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const handleLogout = () => {
    signOut(() => navigate('/'));
  };

  const linkClass = "relative hover:text-primary transition-colors duration-200 font-display uppercase tracking-wider text-xs font-semibold py-2 px-1 block group";
  const linkUnderline = "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-card/90 backdrop-blur-md border-b-2 border-border shadow-md"
    >
      {/* Decorative safety line top */}
      <div className="h-1 stripe-bg w-full"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              to="/"
              className="flex items-center space-x-3 font-display font-black text-xl hover:opacity-95 transition-opacity group"
            >
              <div className="w-8 h-8 bg-primary border border-border flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[3px_3px_0px_0px_#eb3b3b] transition-all">
                <span className="text-white text-sm font-black">⚡</span>
              </div>
              <span className="text-white tracking-tighter uppercase font-black text-2xl">
                Port<span className="text-primary">Forge</span>
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium tracking-wide text-gray-300"
          >
            {isLoaded && isSignedIn ? (
              <>
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                  <span className={linkUnderline}></span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="relative text-red-500 hover:text-red-400 transition-colors font-display uppercase tracking-wider text-xs font-semibold py-2 px-1 block group">
                    Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                )}
                <Link to="/insights" className={linkClass}>
                  GitHub
                  <span className={linkUnderline}></span>
                </Link>
                <Link to="/linkedin" className={linkClass}>
                  LinkedIn
                  <span className={linkUnderline}></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-forge-secondary !px-4 !py-2 !text-[10px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/about" className={`${linkClass} hidden md:block`}>
                  About
                  <span className={linkUnderline}></span>
                </Link>
                <Link to="/contact" className={`${linkClass} hidden md:block`}>
                  Contact
                  <span className={linkUnderline}></span>
                </Link>
                <Link to="/faq" className={`${linkClass} hidden sm:block`}>
                  FAQ
                  <span className={linkUnderline}></span>
                </Link>
                <Link to="/notifications" className={linkClass}>
                  Alerts
                  <span className={linkUnderline}></span>
                </Link>
                <Link to="/login" className="hover:text-primary transition-colors text-xs font-display uppercase tracking-wider font-semibold py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-forge-primary !px-5 !py-2 !text-[10px]"
                >
                  Join
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};
