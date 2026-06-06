import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSentSuccess(false);

    setTimeout(() => {
      setSentSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen font-sans overflow-hidden bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Shared Navbar */}
      <Navbar />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.25] pointer-events-none z-0"></div>
      <div className="absolute inset-0 dot-bg opacity-[0.4] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 relative z-10">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Page Header */}
        <div className="text-center mb-20 relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-border bg-secondary/80 text-xs font-bold uppercase tracking-widest text-primary shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2.5 h-2.5 bg-primary glow-pulse"></span>
            <span>COMMUNICATION TERMINAL</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase font-display">
            <span className="block text-white">LET'S BUILD</span>
            <span className="block text-primary">SOMETHING NEW</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto font-semibold uppercase tracking-wider">
            Have features requests? API problems? Drop a report directly to our core developers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Contact Form Section */}
          <div className="lg:col-span-7 border-2 border-border bg-card p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(235,59,59,0.15)] relative fade-in-up stagger-1">
            <div className="absolute top-0 inset-x-0 h-1.5 stripe-bg"></div>
            
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-8 font-display">// DISPATCH_MESSAGE</h3>

            {sentSuccess && (
              <div className="mb-6 p-4 border-2 border-primary bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary shadow-[4px_4px_0px_0px_rgba(18,22,32,1)]">
                [SUCCESS] MESSAGE COMPILED AND DISPATCHED SUCCESSFULLY.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-display">
              <div>
                <label htmlFor="name" className="block font-bold mb-2 text-primary uppercase tracking-widest">
                  Sender Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border-2 border-border px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:border-primary transition-all font-semibold"
                  placeholder="E.G. JOHN DOE"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-bold mb-2 text-primary uppercase tracking-widest">
                  Target Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border-2 border-border px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:border-primary transition-all font-semibold"
                  placeholder="E.G. SENDER@EMAIL.COM"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-bold mb-2 text-primary uppercase tracking-widest">
                  Packet Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border-2 border-border px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:border-primary transition-all font-semibold"
                  placeholder="E.G. FEEDBACK / SUPPORT"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-bold mb-2 text-primary uppercase tracking-widest">
                  Payload Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-background border-2 border-border px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:border-primary transition-all font-semibold resize-none"
                  placeholder="WRITE DETAILED REPORT..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-forge-primary !text-xs disabled:opacity-50"
              >
                {isSubmitting ? '// DISPATCHING...' : '// TRANSMIT_PACKET'}
              </button>
            </form>
          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Direct Lines */}
            <div className="border-2 border-border bg-card p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(235,59,59,0.15)] relative fade-in-up stagger-2">
              <div className="absolute top-0 inset-x-0 h-1 stripe-bg opacity-40"></div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-8 font-display">// DIRECT_CHANNELS</h3>

              <div className="space-y-4 text-xs font-display">
                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">Email Endpoint</p>
                  <p className="text-white font-semibold font-sans text-sm">hello@portforge.dev</p>
                </div>

                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">Social Feed</p>
                  <p className="text-white font-semibold font-sans text-sm">@portforge</p>
                </div>

                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">Developer Room</p>
                  <p className="text-white font-semibold font-sans text-sm">discord.gg/portforge</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="border-2 border-border bg-card p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(235,59,59,0.15)] relative fade-in-up stagger-3">
              <div className="absolute top-0 inset-x-0 h-1 stripe-bg opacity-40"></div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-8 font-display">// COMPILE_STATS</h3>

              <div className="space-y-4 text-xs font-display">
                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">SYNC_SPEED</p>
                  <p className="text-white font-semibold font-sans text-sm">Under 60 seconds average</p>
                </div>

                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">ACTIVE_TIER</p>
                  <p className="text-white font-semibold font-sans text-sm">Basic generator free forever</p>
                </div>

                <div className="p-4 bg-background border border-border">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-1">COMPLIANCE</p>
                  <p className="text-white font-semibold font-sans text-sm">Clean modular layouts</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};