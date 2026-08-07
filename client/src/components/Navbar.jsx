import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';
import { useAppUser } from '../hooks/useAppUser';

export const Navbar = () => {
  const { isLoaded, isSignedIn } = useAppUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dev-only: 5 rapid clicks on the logo opens the hidden testing page.
  // The whole handler is gated behind import.meta.env.DEV so it's a no-op
  // (and the /dev-testing route doesn't exist at all) in a production build.
  const logoClicks = useRef({ count: 0, timer: null });
  const handleLogoClick = (e) => {
    if (!import.meta.env.DEV) return;
    const state = logoClicks.current;
    state.count += 1;
    clearTimeout(state.timer);
    state.timer = setTimeout(() => { state.count = 0; }, 1500);
    if (state.count >= 5) {
      state.count = 0;
      e.preventDefault();
      navigate('/dev-testing');
    }
  };

  const handleLogout = () => {
    const isDev = localStorage.getItem('isDeveloperMode') === 'true';
    if (isDev) {
      // Dev bypass mode — no real Clerk session, just clear the flag and go home
      localStorage.removeItem('isDeveloperMode');
      setMobileOpen(false);
      navigate('/');
    } else {
      signOut(() => navigate('/'));
      setMobileOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`relative font-display uppercase tracking-wider text-xs font-semibold py-2 px-1 block group transition-colors duration-200
        ${isActive(to) ? 'text-primary' : 'text-gray-300 hover:text-primary'}
        ${className}`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-200
        ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  );

  const authLinks = [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/profile-edit', label: 'Profile'   },
    { to: '/insights',     label: 'Insights'  },
    { to: '/resume',       label: 'Resume'    },
    { to: '/analyze',      label: 'Analysis'  },
    { to: '/notifications',label: 'Alerts'    },
  ];

  const publicLinks = [
    { to: '/analyze',       label: 'Analysis' },
    { to: '/about',         label: 'About'   },
    { to: '/contact',       label: 'Contact' },
    { to: '/faq',           label: 'FAQ'     },
    { to: '/notifications', label: 'Alerts'  },
  ];

  return (
    <motion.nav
      // `initial={false}` renders directly in the `animate` end-state (y: 0,
      // fully visible) instead of starting at y:-80 and depending on the
      // mount animation to bring it into view. Dashboard mounts several
      // API calls at once (profile, projects, auto AI-ranking) — on a
      // slower device that can delay this animation long enough that the
      // nav appears stuck off-screen. Site navigation shouldn't be able to
      // end up invisible just because an entrance flourish didn't fire.
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-card/90 backdrop-blur-md border-b-2 border-border shadow-md no-print"
    >
      {/* Top stripe */}
      <div className="h-1 stripe-bg w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-3 font-display font-black text-xl hover:opacity-95 transition-opacity group"
          >
            <img
              src="/logo-mark.png"
              alt="PortForge"
              width={32}
              height={32}
              className="w-8 h-8 rounded-md shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[3px_3px_0px_0px_#eb3b3b] transition-all"
            />
            <span className="text-white tracking-tighter uppercase font-black text-2xl">
              Port<span className="text-primary">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide text-gray-300">
            {isLoaded && isSignedIn ? (
              <>
                {authLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}>{label}</NavLink>
                ))}
                {isAdmin && (
                  <NavLink to="/admin" className="!text-red-500 hover:!text-red-400">
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-forge-secondary !px-4 !py-2 !text-[10px] ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {publicLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}>{label}</NavLink>
                ))}
                <Link to="/login" className="hover:text-primary transition-colors text-xs font-display uppercase tracking-wider font-semibold py-2 ml-1">
                  Sign In
                </Link>
                <Link to="/register" className="btn-forge-primary !px-5 !py-2 !text-[10px] ml-1">
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t-2 border-border bg-card"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {isLoaded && isSignedIn ? (
                <>
                  {authLinks.map(({ to, label }) => (
                    <NavLink key={to} to={to}>{label}</NavLink>
                  ))}
                  {isAdmin && (
                    <NavLink to="/admin" className="!text-red-500">Admin</NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn-forge-secondary !px-4 !py-2 !text-[10px] mt-2 w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {publicLinks.map(({ to, label }) => (
                    <NavLink key={to} to={to}>{label}</NavLink>
                  ))}
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors text-xs font-display uppercase tracking-wider font-semibold py-2">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-forge-primary !px-5 !py-2 !text-[10px] mt-1 text-center">
                    Join
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
