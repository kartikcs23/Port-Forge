import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';

export const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const handleLogout = () => {
    signOut(() => navigate('/'));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="sticky top-0 z-50 bg-background border-b-2 border-ink"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/"
              className="flex items-center space-x-3 font-black text-2xl text-ink hover:text-accent transition-colors duration-200 uppercase tracking-widest"
            >
              <div className="w-6 h-6 bg-accent border-2 border-ink shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center -rotate-12">
              </div>
              <span>PORTFORGE</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden md:ml-6 md:flex md:items-center md:space-x-8 text-sm font-bold uppercase tracking-widest font-sans"
          >
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-red-600 hover:text-red-700 transition-colors border-b-2 border-transparent hover:border-red-600 pb-1 font-black"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/insights"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  GitHub
                </Link>
                <Link
                  to="/linkedin"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  LinkedIn
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline ml-4 !px-6 !py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  Contact
                </Link>
                <Link
                  to="/privacy"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  Privacy
                </Link>
                <Link
                  to="/faq"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  FAQ
                </Link>
                <Link
                  to="/notifications"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  Notifications
                </Link>
                <Link
                  to="/login"
                  className="text-ink hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-solid ml-4 !px-6 !py-2 bg-ink text-white hover:bg-accent border hover:border-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
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
