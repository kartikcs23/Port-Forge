import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/privacy', label: 'Privacy' },
  ];

  return (
    <footer className="border-t-2 border-border bg-card text-white relative overflow-hidden dot-bg">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-primary/40"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo-mark.png"
              alt="PortForge"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[3px_3px_0px_0px_#eb3b3b] transition-all"
            />
            <span className="font-display font-black text-white tracking-wide text-sm">PORTFORGE</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-display uppercase tracking-wider text-[11px] font-semibold text-muted-foreground">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center md:text-right">
            © {currentYear} PortForge
          </p>
        </div>
      </div>
    </footer>
  );
};
