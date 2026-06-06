import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Privacy = () => {
  const [activeSection, setActiveSection] = useState(0);

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
    <div className="min-h-screen font-sans overflow-hidden bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Shared Navbar */}
      <Navbar />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.25] pointer-events-none z-0"></div>
      <div className="absolute inset-0 dot-bg opacity-[0.4] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 relative z-10">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Page Header */}
        <div className="text-center mb-20 relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-border bg-secondary/80 text-xs font-bold uppercase tracking-widest text-primary shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2.5 h-2.5 bg-primary glow-pulse"></span>
            <span>PRIVACY COMPLIANCE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase font-display">
            <span className="block text-white">SYSTEM</span>
            <span className="block text-primary">PRIVACY POLICY</span>
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-12 text-xs font-display font-bold uppercase tracking-widest">
            <div className="text-muted-foreground">LAST COMPILED:</div>
            <div className="bg-secondary text-white px-4 py-2 border border-border shadow-[2px_2px_0px_0px_rgba(235,59,59,0.15)]">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto font-semibold uppercase tracking-wider">
            Review data processing laws, permissions, and compilation metrics recorded by PortForge.
          </p>
        </div>

        {/* Table of Contents sidebar */}
        <div className="border-2 border-border bg-card p-6 md:p-8 mb-16 relative z-10 fade-in-up stagger-1 shadow-[6px_6px_0px_0px_rgba(235,59,59,0.15)]">
          <div className="absolute top-0 inset-x-0 h-1.5 stripe-bg"></div>
          <h2 className="text-sm font-bold uppercase mb-8 text-white tracking-widest font-display">// TABLE_OF_REGISTRIES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-display">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`p-4 text-left border-2 transition-all text-xs font-bold uppercase tracking-wider ${
                  activeSection === index
                    ? 'bg-primary/10 border-primary text-primary shadow-[3px_3px_0px_0px_rgba(18,22,32,1)]'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-white'
                }`}
              >
                <span className="text-primary mr-2">0{index + 1}.</span> {section}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Documents */}
        <div className="space-y-12 relative z-10 text-xs font-display">
          
          {/* Section 1 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">01.</span> INFORMATION WE COLLECT
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                <strong className="text-white">Personal Data:</strong> When you connect through Clerk, we record credentials (name, email endpoint, profile ID) to provision secure access keys.
              </p>
              <p>
                <strong className="text-white">GitHub integration:</strong> We access repository scopes, stars, commit frequencies, and documentation structures to compute portfolio quality scores.
              </p>
              <p>
                <strong className="text-white">LinkedIn metrics:</strong> We extract basic biographies, job titles, and experiences to format headers in generated portfolios.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">02.</span> HOW WE USE INFORMATION
            </h2>
            <div className="space-y-4 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> <strong className="text-white">PORTFOLIO GENERATION:</strong> Compiles layout themes and parses readme files.</p>
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> <strong className="text-white">SERVICE OPTIMIZATION:</strong> Maintains and updates core compiler models.</p>
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> <strong className="text-white">DISPATCHING COMMUNICATIVE LOGS:</strong> Transmits account updates and system status.</p>
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> <strong className="text-white">METRIC SYSTEMS:</strong> Computes analytics and aggregates skill distributions.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">03.</span> INFORMATION SHARING
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                We do <span className="text-white">not</span> sell, lease, or transmit personal data logs to third-party databases for marketing networks.
              </p>
              <p>
                <strong className="text-white">Registry Services:</strong> Trust metrics may be processed by database layers or cloud partners necessary to host the app infrastructure.
              </p>
              <p>
                <strong className="text-white">Public Directories:</strong> Portfolios set to "LIVE" are searchable and accessible by web crawlers or visiting clients.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">04.</span> DATA SECURITY
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                We process files under secure SSL channels and hash data tables. Our authentication system relies on Clerk to verify sessions.
              </p>
              <p>
                No method of data transmission across web grids is <span className="text-white">100% impenetrable</span>. We deploy continuous maintenance patches to secure system registries.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">05.</span> SYSTEM USER RIGHTS
            </h2>
            <div className="space-y-4 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p className="font-bold text-white mb-4">You maintain registry rights to:</p>
              <ul className="space-y-3 ml-2 font-display uppercase tracking-wider text-[11px]">
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Inspect compiled credentials held by the database</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Update or modify incorrect experience profiles</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Wipe database records and terminate URL slug hosts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">06.</span> COOKIES AND TRACKING
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                We use secure local browser files to verify session tokens, track user logins, and persist UI templates across pages.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">07.</span> CHILDREN'S PRIVACY
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                Our services are restricted to active developers. We do not inspect or record credentials from accounts under 13 years of age.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">08.</span> SYSTEM POLICY CHANGES
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                We reserve rights to adjust compilations protocols. System updates will be displayed on this endpoint.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="border-2 border-border bg-card p-8 md:p-10 hover:border-primary transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <h2 className="text-md font-bold text-white tracking-wider uppercase mb-6 pb-4 border-b border-border flex items-center gap-3 font-display">
              <span className="text-primary">09.</span> COMPLIANCE DISPATCH
            </h2>
            <div className="space-y-6 text-gray-400 font-semibold uppercase tracking-wide leading-relaxed font-sans">
              <p>
                For data access reports, contact the system administrators at:
              </p>
              <div className="bg-background p-6 border border-border">
                <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">Email Endpoint:</p>
                <p className="font-semibold text-white mb-4">privacy@portforge.dev</p>
                <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">Location Slug:</p>
                <p className="font-semibold text-white">PortForge Core Lab, California</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};