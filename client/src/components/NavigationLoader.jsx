import React from 'react';

/**
 * NavigationLoader — Professional page transition loader
 * Features sliding panels, morphing shapes, and smooth transitions
 */
export const NavigationLoader = ({ message = "Loading Page", variant = "default" }) => {
  const variants = {
    default: (
      <div className="fixed inset-0 bg-background z-40 flex items-center justify-center">
        <style>{`
          @keyframes slideInLeft {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }

          @keyframes slideInRight {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0); }
          }

          @keyframes scaleIn {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
            100% { transform: scale(1) rotate(360deg); opacity: 1; }
          }

          @keyframes pulseRing {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }

          .panel-left {
            animation: slideInLeft 0.6s ease-out;
          }

          .panel-right {
            animation: slideInRight 0.6s ease-out;
          }

          .center-shape {
            animation: scaleIn 1s ease-out;
          }

          .ring-pulse {
            animation: pulseRing 2s ease-out infinite;
          }
        `}</style>

        {/* Sliding Panels */}
        <div className="absolute inset-0 flex">
          <div className="panel-left flex-1 bg-ink"></div>
          <div className="panel-right flex-1 bg-ink"></div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center">
          <div className="center-shape w-24 h-24 border-4 border-accent shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] bg-surface flex items-center justify-center mb-6 mx-auto">
            <span className="text-3xl">⚡</span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
            {message}
          </h3>

          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="ring-pulse w-32 h-32 border-2 border-accent rounded-full"></div>
          <div className="ring-pulse w-40 h-40 border border-accent rounded-full" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    ),

    minimal: (
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface border-b-2 border-ink z-40">
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }

          .progress-bar {
            animation: progress 2s ease-in-out infinite;
          }
        `}</style>
        <div className="progress-bar h-full bg-accent shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
      </div>
    ),

    overlay: (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          .bounce-icon {
            animation: bounce 1s ease-in-out infinite;
          }
        `}</style>

        <div className="bg-surface border-4 border-ink shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] p-8 text-center">
          <div className="spinner w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="bounce-icon text-4xl mb-2">⚡</div>
          <p className="font-bold uppercase tracking-widest text-sm">{message}</p>
        </div>
      </div>
    )
  };

  return variants[variant] || variants.default;
};