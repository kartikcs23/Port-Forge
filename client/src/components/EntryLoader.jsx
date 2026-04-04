import React, { useEffect, useState } from 'react';

/**
 * EntryLoader — Highly professional entry animation for app initialization
 * Features morphing logo, particle effects, and brutalist design
 */
export const EntryLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 500);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border-4 border-ink rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border-4 border-ink rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-ink"></div>
      </div>

      {/* Particle Effects */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Logo Animation */}
      <div className="relative mb-16">
        {/* Morphing Background */}
        <div className="absolute inset-0 bg-accent opacity-10 blur-3xl animate-pulse"></div>

        {/* Logo Container */}
        <div className="relative">
          <style>{`
            @keyframes morph {
              0%, 100% { border-radius: 0; transform: rotate(0deg) scale(1); }
              25% { border-radius: 50%; transform: rotate(90deg) scale(1.1); }
              50% { border-radius: 25%; transform: rotate(180deg) scale(0.9); }
              75% { border-radius: 75%; transform: rotate(270deg) scale(1.05); }
            }

            @keyframes slideIn {
              0% { transform: translateY(50px) scale(0.8); opacity: 0; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }

            @keyframes textGlow {
              0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
              50% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
            }

            .logo-shape {
              animation: morph 4s ease-in-out infinite;
            }

            .brand-text {
              animation: slideIn 1s ease-out, textGlow 2s ease-in-out infinite alternate;
            }
          `}</style>

          {/* Animated Shape */}
          <div className="logo-shape w-32 h-32 border-4 border-ink shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] bg-surface flex items-center justify-center mb-8 mx-auto">
            <span className="text-6xl font-black">⚡</span>
          </div>

          {/* Brand Text */}
          <div className="text-center">
            <h1 className="brand-text text-6xl md:text-8xl font-black uppercase tracking-tighter text-ink mb-4">
              Port<span className="text-accent">Forge</span>
            </h1>
            <p className="text-muted font-bold uppercase tracking-widest text-sm">
              Professional Portfolio Generator
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-80 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-muted">Initializing</span>
          <span className="text-xs font-black uppercase tracking-widest text-ink">{progress}%</span>
        </div>

        <div className="h-2 bg-surface border-2 border-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading States */}
      <div className="mt-8 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
          {progress < 30 && "Loading Assets"}
          {progress >= 30 && progress < 60 && "Connecting Services"}
          {progress >= 60 && progress < 90 && "Initializing Components"}
          {progress >= 90 && "Ready to Launch"}
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-ink rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};