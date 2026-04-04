import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';

export const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-ink font-sans overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div
          className="absolute w-64 h-64 bg-accent/3 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.01}%`,
            bottom: `${mousePosition.y * 0.01}%`,
            animationDelay: '1s',
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      <Navbar />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Section with Enhanced Animations */}
        <div className="text-center mb-20 relative">
          <div className="inline-block border-4 border-ink px-6 py-2 mb-12 bg-surface shadow-brutal font-black text-sm uppercase tracking-widest text-accent transform hover:scale-105 transition-transform duration-300 animate-pulse">
            🚀 PORTFORGE BETA IS LIVE 🚀
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black mb-8 leading-[0.85] relative">
            <span className="block text-ink transform hover:scale-105 transition-transform duration-500 hover:text-accent animate-float">
              BUILD
            </span>
            <span className="block text-ink transform hover:scale-105 transition-transform duration-500 hover:text-accent animate-float" style={{ animationDelay: '0.2s' }}>
              A PRO PORTFOLIO.
            </span>
            <span className="block text-accent transform hover:scale-110 transition-transform duration-700 animate-bounce-gentle shadow-text-glow">
              IN SECONDS.
            </span>
          </h1>

          <div className="relative inline-block">
            <p className="text-2xl text-muted mb-12 leading-relaxed max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300 font-medium">
              Connect your GitHub and LinkedIn. PortForge automatically generates a stunning, shareable portfolio website with{' '}
              <span className="text-accent font-black animate-pulse">ZERO DESIGN SKILLS</span>{' '}
              required. Just pure, unadulterated{' '}
              <span className="text-accent font-black animate-bounce">PROFESSIONAL MAGIC</span>.
            </p>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent rounded-full animate-bounce shadow-brutal" style={{ animationDelay: '0s' }} />
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-accent rounded-full animate-bounce shadow-brutal" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-4 -left-8 w-4 h-4 bg-accent rounded-full animate-bounce shadow-brutal" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Mission & Vision with Enhanced Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-105 hover:-rotate-1 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-spin-slow">🎯</div>
              <h3 className="text-4xl font-black mb-6 text-accent group-hover:text-ink transition-colors duration-300">OUR MISSION</h3>
              <p className="text-xl text-muted leading-relaxed group-hover:text-ink transition-colors duration-300">
                To <span className="text-accent font-black">DEMOCRATIZE</span> professional portfolio creation by leveraging cutting-edge AI and automation, making it accessible for developers of{' '}
                <span className="text-accent font-black">ALL SKILL LEVELS</span> to create portfolios that truly represent their capabilities.
              </p>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-105 hover:rotate-1 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-pulse">🔮</div>
              <h3 className="text-4xl font-black mb-6 text-accent group-hover:text-ink transition-colors duration-300">OUR VISION</h3>
              <p className="text-xl text-muted leading-relaxed group-hover:text-ink transition-colors duration-300">
                A world where every developer, regardless of design skills or technical background, can create a portfolio that{' '}
                <span className="text-accent font-black">OPENS DOORS</span> to incredible opportunities and showcases their true potential.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="bg-surface p-12 shadow-brutal border-4 border-ink mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 animate-pulse" />
          <h3 className="text-5xl font-black mb-12 text-center text-accent relative z-10 animate-bounce-gentle">
            WHAT MAKES US CRAZY DIFFERENT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="text-center group transform hover:scale-110 transition-all duration-500">
              <div className="w-24 h-24 bg-accent text-ink rounded-full flex items-center justify-center font-black text-4xl mb-6 mx-auto shadow-brutal group-hover:shadow-brutal-hover transition-all duration-300 animate-spin-slow">
                🤖
              </div>
              <h4 className="font-black text-2xl mb-4 group-hover:text-accent transition-colors duration-300">AI-POWERED</h4>
              <p className="text-muted text-lg leading-relaxed group-hover:text-ink transition-colors duration-300">
                Intelligent analysis of your GitHub and LinkedIn to create{' '}
                <span className="text-accent font-black">PERSONALIZED</span> portfolios that actually represent YOU.
              </p>
            </div>

            <div className="text-center group transform hover:scale-110 transition-all duration-500">
              <div className="w-24 h-24 bg-accent text-ink rounded-full flex items-center justify-center font-black text-4xl mb-6 mx-auto shadow-brutal group-hover:shadow-brutal-hover transition-all duration-300 animate-bounce">
                ⚡
              </div>
              <h4 className="font-black text-2xl mb-4 group-hover:text-accent transition-colors duration-300">LIGHTNING FAST</h4>
              <p className="text-muted text-lg leading-relaxed group-hover:text-ink transition-colors duration-300">
                Generate professional portfolios in{' '}
                <span className="text-accent font-black">UNDER 60 SECONDS</span>, not hours of painful design work.
              </p>
            </div>

            <div className="text-center group transform hover:scale-110 transition-all duration-500">
              <div className="w-24 h-24 bg-accent text-ink rounded-full flex items-center justify-center font-black text-4xl mb-6 mx-auto shadow-brutal group-hover:shadow-brutal-hover transition-all duration-300 animate-pulse">
                🎨
              </div>
              <h4 className="font-black text-2xl mb-4 group-hover:text-accent transition-colors duration-300">BEAUTIFUL DESIGN</h4>
              <p className="text-muted text-lg leading-relaxed group-hover:text-ink transition-colors duration-300">
                Stunning, modern designs that make you{' '}
                <span className="text-accent font-black">STAND OUT</span> and get noticed by employers.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <h3 className="text-5xl font-black mb-8 text-accent relative z-10 animate-bounce-gentle">
            JOIN THE REVOLUTION
          </h3>
          <p className="text-2xl text-muted mb-12 max-w-3xl mx-auto relative z-10 transform hover:scale-105 transition-transform duration-300">
            Be part of the future of developer portfolios. Start building yours today and watch your career{' '}
            <span className="text-accent font-black animate-pulse">EXPLODE</span>.
          </p>

          <div className="relative inline-block">
            <a
              href="/"
              className="inline-block bg-accent text-ink px-12 py-6 font-black text-2xl uppercase tracking-widest shadow-brutal hover:shadow-brutal-hover transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:scale-110 animate-pulse"
            >
              GET STARTED NOW 🚀
            </a>

            {/* Animated border elements */}
            <div className="absolute -inset-2 border-4 border-accent rounded-lg animate-spin-slow opacity-50" />
            <div className="absolute -inset-4 border-2 border-accent rounded-lg animate-spin-slow opacity-25" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .shadow-text-glow {
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
        }
      `}</style>
    </div>
  );
};