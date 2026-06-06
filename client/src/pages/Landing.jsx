import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Landing = () => {
  return (
    <div className="min-h-screen font-sans overflow-hidden bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Shared Nav */}
      <Navbar />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.25] pointer-events-none z-0"></div>
      <div className="absolute inset-0 dot-bg opacity-[0.4] pointer-events-none z-0"></div>

      {/* Industrial Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        
        {/* Glow effect behind hero */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Left Content */}
        <div className="lg:col-span-7 text-left relative z-10 fade-in-up">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-border bg-secondary/80 text-xs font-bold uppercase tracking-widest text-primary shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2.5 h-2.5 bg-primary glow-pulse"></span>
            <span>FORGE CORE v1.0.4 ACTIVE</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tighter uppercase font-display">
            <span className="block text-white">FORGE YOUR</span>
            <span className="block text-white">DEV PROFILE</span>
            <span className="block text-primary cursor-blink">IN SECONDS</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 mb-10 leading-relaxed max-w-lg font-semibold uppercase tracking-wider">
            Connect GitHub and LinkedIn. Our compiler processes your code metrics and compiles a premium portfolio website natively.
          </p>

          <div className="flex flex-wrap gap-4 fade-in-up stagger-2">
            <Link to="/register" className="btn-forge-primary">
              // BUILD_PORTFOLIO
            </Link>
            <a href="#how-it-works" className="btn-forge-secondary">
              // HOW_IT_WORKS
            </a>
          </div>
        </div>

        {/* Hero Right Visual (Industrial Panel representation) */}
        <div className="lg:col-span-5 relative hidden lg:block fade-in-up stagger-3">
          <div className="absolute inset-0 bg-primary/10 rounded-none blur-2xl transform translate-x-4 translate-y-4"></div>
          
          <div className="border-2 border-border bg-card p-6 min-h-[26rem] flex flex-col justify-between relative shadow-[8px_8px_0px_0px_rgba(235,59,59,0.15)] hover:shadow-[8px_8px_0px_0px_rgba(235,59,59,0.7)] hover:border-primary transition-all duration-300">
            {/* Warning stripes top */}
            <div className="absolute top-0 inset-x-0 h-1.5 stripe-bg"></div>
            
            <div className="flex justify-between items-center mt-2 border-b-2 border-border pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500/80 border border-border"></div>
                <div className="w-3 h-3 bg-yellow-500/80 border border-border"></div>
                <div className="w-3 h-3 bg-green-500/80 border border-border"></div>
              </div>
              <span className="text-[10px] font-bold font-display uppercase tracking-widest text-muted-foreground">// SYSTEM_LOGGER</span>
            </div>
            
            <div className="space-y-4 w-full mt-6 flex-grow font-display text-xs">
              <div className="w-full bg-background border border-border p-3 flex items-center justify-between">
                <span className="text-muted-foreground uppercase tracking-widest">COMPILE_STATUS:</span>
                <span className="text-primary font-bold">READY</span>
              </div>
              
              <div className="w-full bg-background border border-border p-4 flex flex-col justify-center space-y-2 relative overflow-hidden">
                <div className="absolute inset-0 stripe-gray-bg opacity-20 pointer-events-none"></div>
                <div className="flex justify-between font-bold text-white uppercase tracking-wider relative z-10">
                  <span>GITHUB_SYNC:</span>
                  <span className="text-green-400">100% SUCCESS</span>
                </div>
                <div className="h-1 bg-border w-full relative z-10">
                  <div className="h-full bg-primary w-full"></div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2 bg-background border border-border p-3 text-center uppercase tracking-widest font-bold text-white relative group cursor-pointer hover:border-primary transition-all">
                  <span className="text-[10px] block text-muted-foreground">THEME</span>
                  <span className="text-[11px] block mt-1 text-primary">TOKYO_CYBER</span>
                </div>
                <div className="w-1/2 bg-background border border-border p-3 text-center uppercase tracking-widest font-bold text-white relative group cursor-pointer hover:border-primary transition-all">
                  <span className="text-[10px] block text-muted-foreground">SCORE</span>
                  <span className="text-[11px] block mt-1 text-primary">9.4/10 QS</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-border pt-4 mt-6 flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>PF_SECURE_BUILD: OK</span>
              <span>EST_LOAD: 0.4s</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-32 relative border-t-2 border-border bg-card/20 dot-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-24 text-center fade-in-up">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tighter uppercase font-display">
              COMPILATION PIPELINE
            </h2>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary max-w-2xl mx-auto">
              // Three stages to generate your customized presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Step 1 */}
            <div className="forge-card fade-in-up stagger-1">
              <div className="absolute top-0 right-0 p-4 font-display font-black text-3xl text-primary/20">01</div>
              <div className="w-12 h-12 bg-secondary border-2 border-border flex items-center justify-center text-primary text-xl font-bold mb-8 shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
                ⌨️
              </div>
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-display">
                LINK SOURCES
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wide">
                Securely sync your GitHub and LinkedIn profiles. We read public repository metrics and professional biographies instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="forge-card fade-in-up stagger-2">
              <div className="absolute top-0 right-0 p-4 font-display font-black text-3xl text-primary/20">02</div>
              <div className="w-12 h-12 bg-secondary border-2 border-border flex items-center justify-center text-primary text-xl font-bold mb-8 shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
                ⚙️
              </div>
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-display">
                AI OPTIMIZATION
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wide">
                Our Gemini AI engine rates documentation, processes commit frequency, and automatically formats projects into beautiful structured logs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="forge-card fade-in-up stagger-3">
              <div className="absolute top-0 right-0 p-4 font-display font-black text-3xl text-primary/20">03</div>
              <div className="w-12 h-12 bg-secondary border-2 border-border flex items-center justify-center text-primary text-xl font-bold mb-8 shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
                🚀
              </div>
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-display">
                DEPLOY LIVE
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wide">
                Select your preferred terminal theme (Tokyo, Brutalist, Luxor), register your custom URL slug, and share your site with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolkit Features Grid */}
      <section id="toolkit" className="py-32 relative border-t-2 border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b-2 border-border">
            <div className="text-left">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase font-display">
                DEV TOOLKIT
              </h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mt-4 md:mt-0 font-display">
              // System Capabilities & Modules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Quality Scoring Heuristics',
                description: 'Our algorithms inspect README details, project assets, and contribution consistency to display your absolute best code.',
              },
              {
                icon: '🎨',
                title: 'High-Fidelity Visual Presets',
                description: 'Switch templates instantly. Clean grid themes, retro terminal styles, and bold brutalism. Minimal setup, zero clutter.',
              },
              {
                icon: '🔄',
                title: 'Real-time Synchronization',
                description: 'Whenever you push code changes to GitHub, your portfolio dynamically syncs metrics in the background. Maintenance-free.',
              },
              {
                icon: '📱',
                title: 'Cross-Device Compilations',
                description: 'Fully responsive wireframe designs styled using strict css variables. Renders consistently on mobile screens and wide monitors.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="forge-card flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center text-primary text-xl font-bold shadow-[2px_2px_0px_0px_rgba(235,59,59,0.1)] shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-md font-bold uppercase tracking-wide text-white mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <footer className="border-t-2 border-border py-32 text-center relative overflow-hidden bg-card/35 dot-bg">
        <div className="absolute inset-0 bg-primary/5 rounded-none blur-3xl pointer-events-none"></div>
        <div className="relative z-10 fade-in-up">
          <h2 className="text-4xl sm:text-6xl font-black mb-10 tracking-tighter uppercase font-display text-white">
            READY TO DEPLOY?
          </h2>
          <Link to="/register" className="btn-forge-primary !text-sm">
            // INITIALIZE_BUILD
          </Link>
          
          <div className="mt-24 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-display">
             © {new Date().getFullYear()} PortForge Core. Engineered for professionals.
          </div>
        </div>
      </footer>
    </div>
  );
};
