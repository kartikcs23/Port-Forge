import React, { useState, useEffect } from 'react';

/**
 * CentralLoader — Highly professional loader for long operations
 * Features advanced animations, progress tracking, and detailed feedback
 */
export const CentralLoader = ({
  message = "Processing",
  subtitle = "",
  progress = null,
  showProgress = true,
  size = "large",
  variant = "default"
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizes = {
    small: "w-64",
    medium: "w-80",
    large: "w-96"
  };

  const variants = {
    default: (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <style>{`
          @keyframes morphShape {
            0%, 100% { border-radius: 0; transform: rotate(0deg) scale(1); }
            25% { border-radius: 50%; transform: rotate(90deg) scale(1.1); }
            50% { border-radius: 25%; transform: rotate(180deg) scale(0.9); }
            75% { border-radius: 75%; transform: rotate(270deg) scale(1.05); }
          }

          @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          }

          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2); }
          }

          @keyframes textShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .morphing-shape {
            animation: morphShape 3s ease-in-out infinite;
          }

          .floating-particle {
            animation: particleFloat 4s ease-in-out infinite;
          }

          .glow-effect {
            animation: glowPulse 2s ease-in-out infinite;
          }

          .shimmer-text {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: textShimmer 2s ease-in-out infinite;
            background-clip: text;
            -webkit-background-clip: text;
          }
        `}</style>

        <div className={`${sizes[size]} max-w-md`}>
          {/* Main Container */}
          <div className="bg-surface border-4 border-ink shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] glow-effect">
            {/* Header */}
            <div className="border-b-2 border-ink p-6 text-center">
              <div className="morphing-shape w-20 h-20 border-4 border-accent bg-background flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-ink mb-1">
                {message}{dots}
              </h2>
              {subtitle && (
                <p className="text-sm font-bold uppercase tracking-widest text-muted">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Progress Section */}
            {showProgress && (
              <div className="p-6 border-b-2 border-ink">
                {progress !== null ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black uppercase tracking-widest text-muted">Progress</span>
                      <span className="text-xs font-black uppercase tracking-widest text-ink">{progress}%</span>
                    </div>
                    <div className="h-3 bg-background border-2 border-ink shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                      <div
                        className="h-full bg-accent transition-all duration-500 ease-out shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-3">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-accent rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">
                      Please wait...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Floating Particles */}
            <div className="relative p-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="floating-particle absolute w-2 h-2 bg-accent rounded-full opacity-60"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${20 + (i * 8)}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}

              <div className="text-center relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted shimmer-text">
                  PortForge Engine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    compact: (
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-surface border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-4 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-ink">{message}{dots}</p>
            {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
          </div>
        </div>
      </div>
    ),

    fullscreen: (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <style>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.5); }
          }

          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .wave-bar {
            animation: wave 1s ease-in-out infinite;
          }

          .rotating-shape {
            animation: rotate 3s linear infinite;
          }
        `}</style>

        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-accent rotating-shape"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-ink rotating-shape" style={{ animationDirection: 'reverse' }}></div>
        </div>

        {/* Wave Animation */}
        <div className="flex gap-1 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="wave-bar w-2 bg-accent"
              style={{
                height: `${20 + i * 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-ink mb-4">
            {message}{dots}
          </h2>
          {subtitle && (
            <p className="text-lg font-bold text-muted mb-6">{subtitle}</p>
          )}

          {progress !== null && (
            <div className="w-64 mx-auto">
              <div className="h-2 bg-surface border-2 border-ink shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] mb-2">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{progress}% Complete</p>
            </div>
          )}
        </div>
      </div>
    )
  };

  return variants[variant] || variants.default;
};