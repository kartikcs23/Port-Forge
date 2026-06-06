import React from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const About = () => {
  return (
    <div className="min-h-screen font-sans overflow-hidden bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Shared Navbar */}
      <Navbar />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.25] pointer-events-none z-0"></div>
      <div className="absolute inset-0 dot-bg opacity-[0.4] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 relative z-10">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header Block */}
        <div className="text-center mb-24 relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-border bg-secondary/80 text-xs font-bold uppercase tracking-widest text-primary shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2.5 h-2.5 bg-primary glow-pulse"></span>
            <span>PORTFORGE ORIGINS</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase font-display">
            <span className="block text-white">WE BUILT A BETTER</span>
            <span className="block text-primary">PORTFOLIO COMPILER</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-semibold uppercase tracking-wider">
            Our mission is to compile developer data directly into professional portfolio systems. No manual layout editing required. Just raw, optimized developer metrics.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 relative z-10">
          <div className="forge-card fade-in-up stagger-1">
            <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center text-primary text-xl font-bold mb-6">
              🎯
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-white font-display">THE MISSION</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wide">
              To automate professional portfolio creation by compiling raw code statistics, repository readmes, and career timelines. Making high-fidelity presentation accessible for engineers of all skill levels.
            </p>
          </div>

          <div className="forge-card fade-in-up stagger-2">
            <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center text-primary text-xl font-bold mb-6">
              🔭
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-white font-display">THE VISION</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wide">
              A streamlined engineering workspace where every developer hosts a verified, dynamically-updated digital signature that highlights code standards, documentation precision, and technical skills natively.
            </p>
          </div>
        </div>

        {/* Feature Highlights Panel */}
        <div className="relative z-10 mb-24 fade-in-up stagger-3">
          <div className="border-2 border-border bg-card p-12 overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(235,59,59,0.15)]">
            <div className="absolute top-0 inset-x-0 h-1.5 stripe-bg"></div>
            
            <h3 className="text-2xl font-black mb-12 text-center text-white tracking-wider uppercase font-display">
              COMPILER SPECIFICATIONS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              
              {/* Item 1 */}
              <div className="bg-background border border-border p-8 hover:border-primary transition-colors">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary text-md font-bold mb-6 border border-border">
                  🤖
                </div>
                <h4 className="font-bold text-sm mb-3 text-white uppercase tracking-wider font-display">AI METRICS</h4>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide leading-relaxed">
                  Automatic scanning of repositories, documentation structure, code languages, and project details powered by LLM heuristics.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-background border border-border p-8 hover:border-primary transition-colors relative">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary text-md font-bold mb-6 border border-border">
                  ⚡
                </div>
                <h4 className="font-bold text-sm mb-3 text-white uppercase tracking-wider font-display">INSTANT BUILD</h4>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide leading-relaxed">
                  Generate portfolio URLs in seconds. Simply authenticate your account and sync. No manual HTML/CSS styling required.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-background border border-border p-8 hover:border-primary transition-colors">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary text-md font-bold mb-6 border border-border">
                  ✨
                </div>
                <h4 className="font-bold text-sm mb-3 text-white uppercase tracking-wider font-display">RAW STYLING</h4>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide leading-relaxed">
                  Sleek layouts prioritizing readability, project architecture, and core statistics. Clear interfaces that highlight your work.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center fade-in-up stagger-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-4xl sm:text-6xl font-black mb-8 text-white tracking-tighter uppercase font-display">
              INITIALIZE YOUR INSTANCE
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-12 max-w-2xl mx-auto font-semibold uppercase tracking-wider">
              Host your verified profile under our custom domain system today. Show what you can build.
            </p>

            <Link
              to="/register"
              className="btn-forge-primary !text-sm"
            >
              // CONVERT_TO_PORTFOLIO
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};