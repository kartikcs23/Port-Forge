import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Loader3D } from '../components/Loader3D';

/**
 * Landing — Homepage for unauthenticated users
 * Hero section, how-it-works, and CTA to register
 */
export const Landing = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page load animation
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader3D message="Loading PortForge..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black mb-6 float-animation">
          <span className="gradient-text block text-7xl">Build Your Portfolio</span>
          <span className="text-slate-300 mt-4 block">In Seconds, Not Hours</span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed float-animation" style={{ animationDelay: '0.1s' }}>
          Connect your GitHub and LinkedIn, and PortForge automatically generates
          a stunning, shareable portfolio website. No design skills required.
        </p>

        <Link
          to="/register"
          className="btn-gradient inline-block text-lg float-animation"
          style={{ animationDelay: '0.2s' }}
        >
          ✨ Get Started Free
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-5xl font-bold text-center text-slate-100 mb-4">
          How PortForge Works
        </h2>
        <p className="text-center text-slate-400 mb-20 text-lg">
          Three simple steps to your perfect portfolio
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-card-hover p-8 text-center group">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">🔗</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-blue-400 transition-colors">
              Step 1: Connect
            </h3>
            <p className="text-slate-400">
              Link your GitHub and LinkedIn accounts securely. We use OAuth for safe authentication.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card-hover p-8 text-center group">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">⚙️</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-purple-400 transition-colors">
              Step 2: Sync
            </h3>
            <p className="text-slate-400">
              PortForge pulls your projects, skills, education, and work experience in real-time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card-hover p-8 text-center group">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">🚀</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-pink-400 transition-colors">
              Step 3: Share
            </h3>
            <p className="text-slate-400">
              Get a unique portfolio link (portforge.app/your-name) and share with employers.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-slate-800/20 to-transparent py-24 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-slate-100 mb-4">
            Legendary Features
          </h2>
          <p className="text-center text-slate-400 mb-20 text-lg">
            Everything you need to showcase your work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '⭐',
                title: 'Auto-Score Projects',
                description: 'Projects ranked by stars, forks, and activity',
              },
              {
                icon: '🎨',
                title: 'Beautiful Themes',
                description: 'Choose from professional portfolio themes',
              },
              {
                icon: '📱',
                title: 'Mobile Responsive',
                description: 'Perfect on any device, desktop to mobile',
              },
              {
                icon: '🔄',
                title: 'Real-Time Sync',
                description: 'Updates automatically from GitHub & LinkedIn',
              },
              {
                icon: '✨',
                title: 'Modern Design',
                description: 'Sleek, professional UI that impresses',
              },
              {
                icon: '🔐',
                title: 'Secure & Fast',
                description: 'Enterprise-grade security and performance',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card-hover p-8 flex gap-6 hover-lift"
              >
                <div className="text-5xl flex-shrink-0 group-hover:spin transition-transform duration-300">{feature.icon}</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl transform -translate-x-1/2"></div>
        </div>

        <h2 className="text-5xl font-bold text-slate-100 mb-6">
          Ready to Build Your Portfolio?
        </h2>
        <p className="text-xl text-slate-400 mb-12">
          Join hundreds of developers showcasing their work
        </p>
        <Link
          to="/register"
          className="btn-gradient-alt inline-block text-lg"
        >
          🚀 Create Your Portfolio Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/50 text-slate-400 py-8 text-center">
        <p>&copy; 2026 PortForge. Built with ❤️ for developers. Legendary.</p>
      </footer>
    </div>
  );
};
