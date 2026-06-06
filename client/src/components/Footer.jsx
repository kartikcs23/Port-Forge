import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-border bg-card text-white relative overflow-hidden dot-bg">
      {/* Accent border highlight */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-primary/40"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-border pb-12">
          
          {/* Brand */}
          <div className="fade-in-up stagger-1">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="w-8 h-8 bg-primary border border-border flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[3px_3px_0px_0px_#eb3b3b] transition-all">
                <span className="text-white text-xs font-black">⚡</span>
              </div>
              <span className="font-display font-black text-white tracking-wide text-lg">PORTFORGE</span>
            </Link>
            <p className="text-xs font-light text-muted-foreground uppercase tracking-wider leading-relaxed">
              Generate your professional developer portfolio in seconds. Built for engineers.
            </p>
          </div>

          {/* Product */}
          <div className="fade-in-up stagger-2">
            <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest font-display">Product</h3>
            <ul className="space-y-3 font-display uppercase tracking-wider text-[11px] font-semibold text-muted-foreground">
              <li>
                <a href="/#how-it-works" className="hover:text-primary transition-colors">
                  // How It Works
                </a>
              </li>
              <li>
                <a href="/#toolkit" className="hover:text-primary transition-colors">
                  // Toolkit
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-primary transition-colors">
                  // Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="fade-in-up stagger-3">
            <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest font-display">Resources</h3>
            <ul className="space-y-3 font-display uppercase tracking-wider text-[11px] font-semibold text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-primary transition-colors">
                  // Privacy
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  // About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">
                  // Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="fade-in-up stagger-4">
            <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest font-display">Terminal</h3>
            <ul className="space-y-3 font-display uppercase tracking-wider text-[11px] font-semibold text-muted-foreground">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  // GitHub_Index
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-primary transition-colors">
                  // KnowledgeBase
                </a>
              </li>
              <li>
                <span className="text-[10px] font-light text-muted-foreground cursor-blink">
                  PF_API_ACTIVE
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 fade-in-up stagger-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center md:text-left">
            © {currentYear} PortForge. Engineered for professionals. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary/80 border border-border px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2 h-2 bg-green-500 rounded-full glow-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
            <span>FORGE STATE: ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
