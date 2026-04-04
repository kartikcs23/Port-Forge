import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { EntryLoader } from '../components/EntryLoader';

export const Landing = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Show entry loader on every visit to home page
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 3500); // Show entry loader for 3.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show entry loader on every page load
  if (!pageLoaded) {
    return <EntryLoader onComplete={() => setPageLoaded(true)} />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-accent selection:text-white">
      <Navbar />

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="text-left relative z-10">
          <div className="inline-block border-2 border-ink px-4 py-1 mb-8 bg-surface shadow-brutal font-bold text-xs uppercase tracking-widest text-accent float-animation">
            PortForge Beta is Live
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 float-animation leading-[0.9]">
            <span className="block text-ink">BUILD</span>
            <span className="block text-ink">A PRO PORTFOLIO.</span>
            <span className="block text-accent">IN SECONDS.</span>
          </h1>

          <p className="text-xl text-muted mb-10 leading-relaxed float-animation" style={{ animationDelay: '0.1s', fontFamily: '"DM Sans", sans-serif' }}>
            Connect your GitHub and LinkedIn. PortForge automatically generates a stunning, shareable portfolio website with no design skills required.
          </p>

          <div className="flex flex-wrap gap-4 float-animation" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-solid">
              Get Started Free
            </Link>
            <a href="#how-it-works" className="btn-outline">
              Learn More
            </a>
          </div>
        </div>

        <div className="relative hidden lg:block float-animation" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 border-2 border-ink"></div>
          <div className="relative bg-surface border-2 border-ink p-8 h-[28rem] flex flex-col justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-ink bg-white"></div>
              <div className="w-3 h-3 border border-ink bg-white"></div>
              <div className="w-3 h-3 border border-ink bg-white"></div>
            </div>
            <div className="space-y-4 w-full mt-4 flex-grow">
              <div className="w-3/4 h-8 bg-background border border-muted/20"></div>
              <div className="w-full h-32 border border-ink bg-cover bg-accent/5"></div>
              <div className="flex gap-4">
                <div className="w-1/2 h-16 bg-accent/10 border-2 border-ink"></div>
                <div className="w-1/3 h-16 bg-background border border-muted/20"></div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section id="how-it-works" className="border-t-2 border-ink bg-surface py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 border-l-2 border-b-2 border-ink bg-accent/5 rounded-bl-full transform translate-x-12 -translate-y-12"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-5xl font-black text-ink mb-4 italic">HOW IT WORKS.</h2>
            <p className="text-muted text-xl font-sans">Three straightforward steps to launch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-ink z-0 border-t-2 border-dashed border-ink bg-transparent opacity-50"></div>
            
            <div className="card-minimal text-left relative z-10 group">
              <div className="w-14 h-14 bg-background border-2 border-ink shadow-brutal flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                1
              </div>
              <h3 className="text-2xl font-black mb-3">Target Sources</h3>
              <p className="text-muted leading-relaxed font-sans">
                Link GitHub and LinkedIn securely. We pull your latest professional history in real-time.
              </p>
            </div>

            <div className="card-minimal text-left relative z-10 group">
              <div className="w-14 h-14 bg-background border-2 border-ink shadow-brutal flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                2
              </div>
              <h3 className="text-2xl font-black mb-3">Sync & Analyze</h3>
              <p className="text-muted leading-relaxed font-sans">
                Our engine evaluates your repositories, computes activity scores, and formats your experience.
              </p>
            </div>

            <div className="card-minimal text-left relative z-10 group">
              <div className="w-14 h-14 bg-background border-2 border-ink shadow-brutal flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                3
              </div>
              <h3 className="text-2xl font-black mb-3">Publish</h3>
              <p className="text-muted leading-relaxed font-sans">
                Select a layout, grab your custom portforge.app URL, and ship it to the world instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t-2 border-ink bg-background overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-ink opacity-10 hidden lg:block"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-ink pb-8">
            <div>
              <h2 className="text-5xl lg:text-7xl font-black text-ink">THE <span className="text-accent underline decoration-ink underline-offset-8">TOOLKIT</span></h2>
            </div>
            <p className="text-muted font-bold tracking-widest uppercase mt-4 md:mt-0 max-w-sm text-left md:text-right font-sans text-sm">
              Everything required to stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
            {[
              {
                icon: '?',
                title: 'Data-Driven Scoring',
                description: 'Algorithms weigh stars, forks, and consistent commits to highlight your very best repositories.',
              },
              {
                icon: '�',
                title: 'Minimalist Themes',
                description: 'Swiss-inspired typography, stark contrast, and zero fluff. Just your work, front and center.',
              },
              {
                icon: '?',
                title: 'Live Synchronization',
                description: 'Commit to master, and your portfolio updates natively. No manual entry required.',
              },
              {
                icon: '?',
                title: 'Device Agnostic',
                description: 'Engineered with responsive breakpoints to look perfectly proportional on any screen size.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-surface p-10 hover:bg-background transition-colors group flex flex-col sm:flex-row gap-6">
                <div className="text-4xl text-accent group-hover:scale-110 transition-transform font-black">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-ink mb-3 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-muted font-sans font-medium text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-ink bg-accent text-white py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-ink/5"></div>
        <div className="relative z-10">
          <h2 className="text-5xl sm:text-7xl font-black mb-8 text-white tracking-widest">READY TO SHIP?</h2>
          <Link to="/register" className="inline-flex items-center justify-center font-bold transition-all duration-200 border-2 border-ink bg-surface text-ink px-12 py-5 uppercase tracking-widest text-sm hover:bg-ink hover:text-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95">
            Create Portfolio
          </Link>
          
          <div className="mt-24 font-bold tracking-widest text-xs opacity-90 uppercase font-sans">
            � {new Date().getFullYear()} PortForge. Engineered for professionals.
          </div>
        </div>
      </footer>

    </div>
  );
};
