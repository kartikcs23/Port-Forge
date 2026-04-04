import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert('🚀 Message sent! We\'ll get back to you faster than you can say "PortForge"! ⚡');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-ink font-sans overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.015}%`,
            top: `${mousePosition.y * 0.015}%`,
            transition: 'all 0.4s ease-out'
          }}
        />
        <div
          className="absolute w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.02}%`,
            bottom: `${mousePosition.y * 0.02}%`,
            animationDelay: '1.5s',
            transition: 'all 0.6s ease-out'
          }}
        />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <Navbar />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-block border-4 border-ink px-8 py-3 mb-12 bg-surface shadow-brutal font-black text-lg uppercase tracking-widest text-accent transform hover:scale-110 transition-transform duration-500 animate-pulse relative">
            💬 LET'S CONNECT 💬
            <div className="absolute -inset-1 border-2 border-accent rounded-lg animate-spin-slow opacity-60" />
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.85] relative">
            LET'S BUILD SOMETHING
            <span className="block text-accent animate-bounce-gentle shadow-text-glow transform hover:scale-105 transition-transform duration-300">
              INCREDIBLE TOGETHER
            </span>
          </h1>

          <div className="relative">
            <p className="text-2xl text-muted leading-relaxed max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300 font-medium">
              Have questions? Ideas? Want to collaborate? Need support?{' '}
              <span className="text-accent font-black animate-pulse">WE'D LOVE TO HEAR FROM YOU!</span>{' '}
              Drop us a line and let's make some magic happen. ✨
            </p>

            {/* Animated speech bubbles */}
            <div className="absolute -top-8 -left-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💭</div>
            <div className="absolute -top-4 -right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💬</div>
            <div className="absolute -bottom-6 -left-12 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🗣️</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Enhanced Contact Form */}
          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="text-5xl mr-4 animate-bounce">📝</div>
                <h3 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">SEND US A MESSAGE</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <label htmlFor="name" className="block text-lg font-black mb-3 uppercase tracking-wider text-accent">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-background border-4 border-ink shadow-brutal focus:outline-none focus:shadow-brutal-hover focus:border-accent transition-all duration-300 text-lg font-medium hover:scale-105 transform"
                    placeholder="Your awesome name"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-lg font-black mb-3 uppercase tracking-wider text-accent">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-background border-4 border-ink shadow-brutal focus:outline-none focus:shadow-brutal-hover focus:border-accent transition-all duration-300 text-lg font-medium hover:scale-105 transform"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="subject" className="block text-lg font-black mb-3 uppercase tracking-wider text-accent">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-background border-4 border-ink shadow-brutal focus:outline-none focus:shadow-brutal-hover focus:border-accent transition-all duration-300 text-lg font-medium hover:scale-105 transform"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-lg font-black mb-3 uppercase tracking-wider text-accent">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    className="w-full px-6 py-4 bg-background border-4 border-ink shadow-brutal focus:outline-none focus:shadow-brutal-hover focus:border-accent transition-all duration-300 text-lg font-medium resize-none hover:scale-105 transform"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-ink px-12 py-6 font-black text-2xl uppercase tracking-widest shadow-brutal hover:shadow-brutal-hover transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isSubmitting ? '🚀 SENDING...' : 'SEND MESSAGE 🚀'}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-10">
            <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="text-5xl mr-4 animate-spin-slow">🎯</div>
                  <h3 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">REACH OUT DIRECTLY</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-6 p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300 group/item">
                    <div className="w-16 h-16 bg-accent text-ink rounded-full flex items-center justify-center font-black text-2xl shadow-brutal group-hover/item:shadow-brutal-hover transition-all duration-300">
                      📧
                    </div>
                    <div className="group-hover/item:text-accent transition-colors duration-300">
                      <p className="font-black text-lg">Email</p>
                      <p className="text-muted font-medium">hello@portforge.dev</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300 group/item">
                    <div className="w-16 h-16 bg-accent text-ink rounded-full flex items-center justify-center font-black text-2xl shadow-brutal group-hover/item:shadow-brutal-hover transition-all duration-300">
                      🐦
                    </div>
                    <div className="group-hover/item:text-accent transition-colors duration-300">
                      <p className="font-black text-lg">Twitter</p>
                      <p className="text-muted font-medium">@portforge</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300 group/item">
                    <div className="w-16 h-16 bg-accent text-ink rounded-full flex items-center justify-center font-black text-2xl shadow-brutal group-hover/item:shadow-brutal-hover transition-all duration-300">
                      💬
                    </div>
                    <div className="group-hover/item:text-accent transition-colors duration-300">
                      <p className="font-black text-lg">Discord</p>
                      <p className="text-muted font-medium">Join our community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="text-4xl mr-4 animate-pulse">❓</div>
                  <h3 className="text-3xl font-black text-accent group-hover:text-ink transition-colors duration-300">FREQUENTLY ASKED</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300">
                    <p className="font-black mb-2 text-accent">How quickly can I get a portfolio?</p>
                    <p className="text-muted font-medium">In <span className="text-accent font-black">UNDER 60 SECONDS</span> with your GitHub and LinkedIn connected! ⚡</p>
                  </div>

                  <div className="p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300">
                    <p className="font-black mb-2 text-accent">Is PortForge free?</p>
                    <p className="text-muted font-medium">Yes! Basic portfolios are <span className="text-accent font-black">COMPLETELY FREE</span>. Premium features available. 🎉</p>
                  </div>

                  <div className="p-4 bg-background border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300">
                    <p className="font-black mb-2 text-accent">Can I customize my portfolio?</p>
                    <p className="text-muted font-medium"><span className="text-accent font-black">ABSOLUTELY!</span> Full customization options for colors, layout, and content. 🎨</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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