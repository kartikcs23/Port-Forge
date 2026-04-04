import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';

export const Privacy = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sections = [
    'Information We Collect',
    'How We Use Information',
    'Information Sharing',
    'Data Security',
    'Your Rights',
    'Cookies and Tracking',
    'Children\'s Privacy',
    'Changes to Policy',
    'Contact Us'
  ];

  return (
    <div className="min-h-screen bg-background text-ink font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}%`,
            top: `${mousePosition.y * 0.01}%`,
            transition: 'all 0.5s ease-out'
          }}
        />
        <div
          className="absolute w-80 h-80 bg-accent/2 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            animationDelay: '2s',
            transition: 'all 0.7s ease-out'
          }}
        />
      </div>

      <Navbar />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-block border-4 border-ink px-8 py-3 mb-12 bg-surface shadow-brutal font-black text-lg uppercase tracking-widest text-accent transform hover:scale-110 transition-transform duration-500 animate-pulse relative">
            🔒 PRIVACY FIRST 🔒
            <div className="absolute -inset-1 border-2 border-accent rounded-lg animate-spin-slow opacity-60" />
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.85] relative">
            PRIVACY
            <span className="block text-accent animate-bounce-gentle shadow-text-glow transform hover:scale-105 transition-transform duration-300">
              POLICY
            </span>
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="text-muted font-medium">Last updated:</div>
            <div className="bg-accent text-ink px-4 py-2 font-black shadow-brutal animate-pulse">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <p className="text-xl text-muted leading-relaxed max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300">
            Your privacy is our <span className="text-accent font-black animate-pulse">TOP PRIORITY</span>.
            We collect only what we need to make PortForge amazing for you. 🔒✨
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-surface p-8 shadow-brutal border-4 border-ink mb-12 transform hover:scale-102 transition-transform duration-300">
          <h2 className="text-3xl font-black mb-6 text-accent text-center">📋 TABLE OF CONTENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`p-3 text-left border-2 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-accent text-ink shadow-brutal-hover'
                    : 'bg-background hover:bg-accent/10'
                }`}
              >
                <span className="font-black text-sm">{index + 1}.</span> {section}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-12">
          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-bounce">📊</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">1. INFORMATION WE COLLECT</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  <strong className="text-ink font-black">Personal Information:</strong> When you create an account, we collect your name, email address, and profile information from authentication providers like Clerk.
                </p>
                <p>
                  <strong className="text-ink font-black">GitHub Data:</strong> With your permission, we access your public GitHub repositories, commit history, and profile information to generate your portfolio.
                </p>
                <p>
                  <strong className="text-ink font-black">LinkedIn Data:</strong> With your permission, we access your LinkedIn profile information to enhance your portfolio content.
                </p>
                <p>
                  <strong className="text-ink font-black">Usage Data:</strong> We collect information about how you use PortForge, including pages visited, features used, and interaction patterns.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-spin-slow">🎯</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">2. HOW WE USE YOUR INFORMATION</h2>
              </div>
              <div className="space-y-4 text-lg text-muted leading-relaxed">
                <p>• <strong className="text-ink font-black">Portfolio Generation:</strong> To create and customize your professional portfolio</p>
                <p>• <strong className="text-ink font-black">Service Provision:</strong> To provide, maintain, and improve PortForge</p>
                <p>• <strong className="text-ink font-black">Communication:</strong> To send you important updates and respond to your inquiries</p>
                <p>• <strong className="text-ink font-black">Analytics:</strong> To understand usage patterns and improve our service</p>
                <p>• <strong className="text-ink font-black">Security:</strong> To protect against fraud and unauthorized access</p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-pulse">🤝</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">3. INFORMATION SHARING</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  We do <span className="text-accent font-black">NOT</span> sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>
                <p>
                  <strong className="text-ink font-black">Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website and conducting our business.
                </p>
                <p>
                  <strong className="text-ink font-black">Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.
                </p>
                <p>
                  <strong className="text-ink font-black">Public Portfolios:</strong> Information you choose to make public in your portfolio will be visible to anyone who visits your portfolio URL.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-bounce">🔐</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">4. DATA SECURITY</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>
                  However, no method of transmission over the internet or electronic storage is{' '}
                  <span className="text-accent font-black">100% SECURE</span>. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-spin-slow">⚖️</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">5. YOUR RIGHTS</h2>
              </div>
              <div className="space-y-4 text-lg text-muted leading-relaxed">
                <p className="font-black text-accent mb-4">You have the right to:</p>
                <ul className="list-none space-y-3 ml-6">
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Access the personal information we hold about you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Correct inaccurate or incomplete information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Delete your account and associated data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Object to or restrict certain processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Data portability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-black mr-3">•</span>
                    <span>Withdraw consent where applicable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-pulse">🍪</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">6. COOKIES AND TRACKING</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
                </p>
                <p>
                  You can control cookie settings through your browser preferences, though disabling cookies may affect functionality.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-bounce">🧒</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">7. CHILDREN'S PRIVACY</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  PortForge is <span className="text-accent font-black">NOT INTENDED</span> for children under 13. We do not knowingly collect personal information from children under 13.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-spin-slow">📝</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">8. CHANGES TO THIS POLICY</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 animate-pulse">📞</div>
                <h2 className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-300">9. CONTACT US</h2>
              </div>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-background p-6 border-2 border-ink shadow-brutal transform hover:scale-105 transition-transform duration-300">
                  <p className="font-black text-accent mb-2">Email:</p>
                  <p className="font-medium mb-4">privacy@portforge.dev</p>
                  <p className="font-black text-accent mb-2">Address:</p>
                  <p className="font-medium">[Company Address]</p>
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