import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-ink bg-ink text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b-2 border-accent pb-12">
          
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-accent border-2 border-accent shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center -rotate-12"></div>
              <span className="font-black text-white uppercase tracking-widest text-lg">PORTFORGE</span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Generate your professional portfolio in seconds.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 border-b-2 border-accent pb-2">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#how-it-works" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Themes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 border-b-2 border-accent pb-2">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 border-b-2 border-accent pb-2">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center md:text-left">
            © {currentYear} PortForge. All rights reserved. Built with minimal design principles.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className="w-2 h-2 bg-accent border border-accent"></span>
            <span>STATUS: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
