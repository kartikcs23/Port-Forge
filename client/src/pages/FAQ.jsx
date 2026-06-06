import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'ALL_METRICS' },
    { id: 'getting-started', name: 'GETTING_STARTED' },
    { id: 'features', name: 'SYSTEM_FEATURES' },
    { id: 'pricing', name: 'RESOURCE_PRICING' },
    { id: 'technical', name: 'TECHNICAL_STACK' },
    { id: 'account', name: 'ACCOUNT_HUB' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: "How do I create my first portfolio?",
      answer: "Getting started is easy! Just connect your GitHub and LinkedIn accounts. Our AI analyzes your code, projects, and experience to automatically generate a stunning portfolio in under 60 seconds. No design skills required!",
      difficulty: "Beginner",
      readTime: "2M"
    },
    {
      id: 2,
      category: 'features',
      question: "What makes PortForge different?",
      answer: "We're not just another template. PortForge uses AI to understand your unique coding style, contributions, and achievements. We create personalized portfolios that actually represent who you are as a developer, not just generic templates.",
      difficulty: "Intermediate",
      readTime: "3M"
    },
    {
      id: 3,
      category: 'pricing',
      question: "Is PortForge really free?",
      answer: "Yes! Basic portfolios are completely free. You get unlimited projects, custom domains, and all core features at no cost. Premium features like advanced analytics and priority support are available for power users.",
      difficulty: "Beginner",
      readTime: "1M"
    },
    {
      id: 4,
      category: 'technical',
      question: "Do I need coding experience to use PortForge?",
      answer: "Not at all! PortForge is designed for developers of all levels. Whether you're a beginner with your first project or a senior engineer with 10+ years experience, our AI adapts to showcase your skills appropriately.",
      difficulty: "Beginner",
      readTime: "2M"
    },
    {
      id: 5,
      category: 'account',
      question: "Can I customize my portfolio after it's generated?",
      answer: "Absolutely! You have full control. Change colors, layouts, add custom sections, reorder content, and personalize every aspect. Your portfolio, your rules!",
      difficulty: "Intermediate",
      readTime: "4M"
    },
    {
      id: 6,
      category: 'features',
      question: "How does the GitHub integration work?",
      answer: "We securely connect to your GitHub account and analyze your repositories, commit patterns, languages used, and contribution history. This creates an accurate representation of your coding expertise and project experience.",
      difficulty: "Advanced",
      readTime: "5M"
    },
    {
      id: 7,
      category: 'technical',
      question: "Is my data secure?",
      answer: "Security first! We use bank-level encryption, never store your passwords, and only access public GitHub data. Your information is protected with enterprise-grade security measures.",
      difficulty: "Intermediate",
      readTime: "3M"
    },
    {
      id: 8,
      category: 'pricing',
      question: "What premium features are available?",
      answer: "Premium unlocks: Advanced analytics, custom domains, priority support, export options, team collaboration, and exclusive themes. Perfect for professionals who want the complete package!",
      difficulty: "Intermediate",
      readTime: "2M"
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen font-sans overflow-hidden bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Shared Navbar */}
      <Navbar />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.25] pointer-events-none z-0"></div>
      <div className="absolute inset-0 dot-bg opacity-[0.4] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 relative z-10">
        
        {/* Glow behind layout */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Page Header */}
        <div className="text-center mb-20 relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-border bg-secondary/80 text-xs font-bold uppercase tracking-widest text-primary shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)]">
            <span className="w-2.5 h-2.5 bg-primary glow-pulse"></span>
            <span>SYSTEM KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase font-display">
            <span className="block text-white">FREQUENTLY ASKED</span>
            <span className="block text-primary">DECLARATIONS</span>
          </h1>

          {/* Industrial Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12 mt-12">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-background border-2 border-border text-white focus:outline-none focus:border-primary transition-all text-sm font-bold font-display uppercase tracking-widest"
            />
          </div>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto font-semibold uppercase tracking-wider">
            Query information databases about generation processes, integrations, and deployment.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10 fade-in-up stagger-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 border-2 border-border font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-[3px_3px_0px_0px_rgba(18,22,32,1)]'
                  : 'bg-card text-muted-foreground hover:text-white hover:border-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className={`border-2 border-border bg-card p-6 md:p-8 flex flex-col h-full fade-in-up transition-all duration-300 ${
                expandedFAQ === faq.id 
                  ? 'border-primary shadow-[6px_6px_0px_0px_rgba(235,59,59,0.15)] bg-card/90' 
                  : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
              style={{ animationDelay: `${(index % 4) * 100 + 200}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4 text-xs font-display">
                    <span className={`px-3 py-1 font-bold border border-border uppercase tracking-widest ${
                      faq.difficulty === 'Beginner' ? 'text-green-400 bg-green-950/20' :
                      faq.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-950/20' :
                      'text-red-400 bg-red-950/20'
                    }`}>
                      {faq.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      [READ_TIME: {faq.readTime}]
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-8 h-8 flex items-center justify-center border-2 border-border bg-background hover:bg-secondary transition-colors text-white font-black font-display text-sm focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                >
                  {expandedFAQ === faq.id ? '−' : '+'}
                </button>
              </div>

              <h3 
                className={`text-md font-bold uppercase tracking-wide cursor-pointer transition-colors font-display ${expandedFAQ === faq.id ? 'text-primary' : 'text-white'}`}
                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              >
                {faq.question}
              </h3>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedFAQ === faq.id ? 'max-h-96 opacity-100 mt-auto' : 'max-h-0 opacity-0'
              }`}>
                <p className="text-xs leading-relaxed text-gray-400 pt-6 border-t-2 border-border border-dashed font-semibold uppercase tracking-wider mt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Need support footer */}
        <div className="text-center mt-24 border-2 border-border bg-card p-12 md:p-16 relative z-10 fade-in-up stagger-3 shadow-[8px_8px_0px_0px_rgba(235,59,59,0.15)]">
          <div className="absolute top-0 inset-x-0 h-1.5 stripe-bg"></div>
          
          <h3 className="text-2xl font-black mb-6 text-white tracking-wider uppercase font-display">
            AWAITING ADDITIONAL METRICS?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-10 max-w-2xl mx-auto font-semibold uppercase tracking-wider">
            If you need customized support, open a ticket report directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-forge-primary"
            >
              // SUBMIT_TICKET
            </Link>

            <Link
              to="/register"
              className="btn-forge-secondary"
            >
              // SIGN_UP
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};