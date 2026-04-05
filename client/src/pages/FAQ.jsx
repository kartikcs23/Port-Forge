import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { id: 'all', name: 'All Questions', icon: '🎯', color: 'accent' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', color: 'blue-500' },
    { id: 'features', name: 'Features', icon: '⚡', color: 'green-500' },
    { id: 'pricing', name: 'Pricing', icon: '💰', color: 'purple-500' },
    { id: 'technical', name: 'Technical', icon: '🔧', color: 'orange-500' },
    { id: 'account', name: 'Account', icon: '👤', color: 'pink-500' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: "How do I create my first portfolio?",
      answer: "Getting started is EASY! Just connect your GitHub and LinkedIn accounts. Our AI analyzes your code, projects, and experience to automatically generate a stunning portfolio in under 60 seconds. No design skills required!",
      icon: "🎨",
      difficulty: "Beginner",
      readTime: "2 min"
    },
    {
      id: 2,
      category: 'features',
      question: "What makes PortForge different from other portfolio builders?",
      answer: "We're not just another template. PortForge uses AI to understand YOUR unique coding style, contributions, and achievements. We create personalized portfolios that actually represent who you are as a developer, not just generic templates.",
      icon: "🤖",
      difficulty: "Intermediate",
      readTime: "3 min"
    },
    {
      id: 3,
      category: 'pricing',
      question: "Is PortForge really free?",
      answer: "YES! Basic portfolios are completely FREE. You get unlimited projects, custom domains, and all core features at no cost. Premium features like advanced analytics and priority support are available for power users.",
      icon: "💎",
      difficulty: "Beginner",
      readTime: "1 min"
    },
    {
      id: 4,
      category: 'technical',
      question: "Do I need coding experience to use PortForge?",
      answer: "Not at all! PortForge is designed for developers of ALL levels. Whether you're a beginner with your first project or a senior engineer with 10+ years experience, our AI adapts to showcase your skills appropriately.",
      icon: "🌟",
      difficulty: "Beginner",
      readTime: "2 min"
    },
    {
      id: 5,
      category: 'account',
      question: "Can I customize my portfolio after it's generated?",
      answer: "Absolutely! You have FULL control. Change colors, layouts, add custom sections, reorder content, and personalize every aspect. Your portfolio, your rules!",
      icon: "🎛️",
      difficulty: "Intermediate",
      readTime: "4 min"
    },
    {
      id: 6,
      category: 'features',
      question: "How does the GitHub integration work?",
      answer: "We securely connect to your GitHub account and analyze your repositories, commit patterns, languages used, and contribution history. This creates an accurate representation of your coding expertise and project experience.",
      icon: "📊",
      difficulty: "Advanced",
      readTime: "5 min"
    },
    {
      id: 7,
      category: 'technical',
      question: "Is my data secure?",
      answer: "SECURITY FIRST! We use bank-level encryption, never store your passwords, and only access public GitHub data. Your information is protected with enterprise-grade security measures.",
      icon: "🔒",
      difficulty: "Intermediate",
      readTime: "3 min"
    },
    {
      id: 8,
      category: 'pricing',
      question: "What premium features are available?",
      answer: "Premium unlocks: Advanced analytics, custom domains, priority support, export options, team collaboration, and exclusive themes. Perfect for professionals who want the complete package!",
      icon: "🚀",
      difficulty: "Intermediate",
      readTime: "2 min"
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="min-h-screen bg-background text-ink font-sans overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-80 h-80 bg-accent/6 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.012}%`,
            top: `${mousePosition.y * 0.012}%`,
            transition: 'all 0.4s ease-out'
          }}
        />
        <div
          className="absolute w-64 h-64 bg-accent/4 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.018}%`,
            bottom: `${mousePosition.y * 0.018}%`,
            animationDelay: '1.5s',
            transition: 'all 0.6s ease-out'
          }}
        />

        {/* Floating Question Marks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-bounce"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.3}s`
            }}
          >
            ❓
          </div>
        ))}
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-block border-4 border-ink px-8 py-3 mb-12 bg-surface shadow-brutal font-black text-xl uppercase tracking-widest text-accent transform hover:scale-110 transition-transform duration-500 animate-pulse relative">
            ❓ FAQ CENTRAL ❓
            <div className="absolute -inset-1 border-2 border-accent rounded-lg animate-spin-slow opacity-60" />
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.85] relative">
            GOT QUESTIONS?
            <span className="block text-accent animate-bounce-gentle shadow-text-glow transform hover:scale-105 transition-transform duration-300">
              WE'VE GOT ANSWERS!
            </span>
          </h1>

          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search questions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-8 py-6 bg-background border-4 border-ink shadow-brutal focus:outline-none focus:shadow-brutal-hover focus:border-accent transition-all duration-300 text-xl font-medium rounded-lg hover:scale-105 transform"
              />
              <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300 ${isSearching ? 'animate-spin' : ''}`}>
                {isSearching ? '🔄' : '🔍'}
              </div>
            </div>

            {/* Search Animation */}
            {isSearching && (
              <div className="absolute inset-0 border-4 border-accent rounded-lg animate-ping opacity-20" />
            )}
          </div>

          <p className="text-2xl text-muted leading-relaxed max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300">
            Find answers faster than a developer debugging code! 💻⚡
            <span className="text-accent font-black animate-pulse"> Search, filter, and discover</span> everything you need to know about PortForge.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-4 border-4 border-ink shadow-brutal font-black text-lg uppercase tracking-wider transform hover:scale-110 transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-accent text-ink shadow-brutal-hover'
                  : 'bg-surface hover:bg-accent/10'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-surface p-8 shadow-brutal border-4 border-ink transform hover:scale-105 transition-all duration-500 group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl group-hover:animate-bounce">{faq.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-ink ${
                          faq.difficulty === 'Beginner' ? 'bg-green-500 text-white' :
                          faq.difficulty === 'Intermediate' ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {faq.difficulty}
                        </span>
                        <span className="text-sm text-muted font-medium">{faq.readTime} read</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="text-3xl transform hover:scale-125 transition-transform duration-300"
                  >
                    {expandedFAQ === faq.id ? '➖' : '➕'}
                  </button>
                </div>

                <h3 className="text-2xl font-black mb-4 group-hover:text-accent transition-colors duration-300">
                  {faq.question}
                </h3>

                <div className={`overflow-hidden transition-all duration-500 ${
                  expandedFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-lg leading-relaxed text-muted pt-4 border-t-2 border-ink">
                    {faq.answer}
                  </p>
                </div>

                {/* Animated border on expand */}
                {expandedFAQ === faq.id && (
                  <div className="absolute inset-0 border-4 border-accent rounded-lg animate-ping opacity-20" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 relative">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <h3 className="text-4xl font-black mb-8 text-accent relative z-10 animate-bounce-gentle">
            STILL HAVE QUESTIONS?
          </h3>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto relative z-10">
            Can't find what you're looking for? Our support team is here to help!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href="/contact"
              className="inline-block bg-accent text-ink px-8 py-4 font-black text-lg uppercase tracking-wider shadow-brutal hover:shadow-brutal-hover transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:scale-110 animate-pulse"
            >
              📞 CONTACT SUPPORT
            </a>

            <a
              href="/"
              className="inline-block bg-surface text-ink px-8 py-4 font-black text-lg uppercase tracking-wider border-4 border-ink shadow-brutal hover:shadow-brutal-hover transition-all duration-300 hover:-translate-y-2 hover:translate-x-2"
            >
              🚀 GET STARTED
            </a>
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