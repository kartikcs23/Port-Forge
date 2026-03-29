import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar — Top navigation component
 * Shows logo, dynamic links based on auth state, and logout button
 */
export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:blur-sm transition-all duration-300"
          >
            <span className="text-2xl">⚡</span>
            <span>PortForge</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-blue-400 font-semibold transition-all duration-300 hover:translate-y-[-2px]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient text-sm px-6 py-2"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-blue-400 font-semibold transition-all duration-300 hover:translate-y-[-2px]"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-500 hover:scale-110 transition-transform"
                    />
                  )}
                  <span className="text-sm text-slate-300 font-medium">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
