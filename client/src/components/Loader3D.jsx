import React from 'react';

/**
 * Loader3D — Animated 3D cube loader component
 * Displays a spinning 3D cube with PortForge branding
 */
export const Loader3D = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 3D Cube Container */}
      <div className="relative w-32 h-32 mb-10" style={{ perspective: '1000px' }}>
        <style>{`
          @keyframes rotate3d {
            0% {
              transform: rotateX(0) rotateY(0) rotateZ(0);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .cube-3d {
            animation: rotate3d 8s linear infinite;
            transform-style: preserve-3d;
            width: 120px;
            height: 120px;
            position: relative;
            margin: 0 auto;
          }

          .cube-face {
            position: absolute;
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: white;
            border: 2px solid;
            backdrop-filter: blur(10px);
            opacity: 0.6;
          }

          .cube-front {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border-color: #60a5fa;
            transform: translateZ(60px);
          }

          .cube-back {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border-color: #a78bfa;
            transform: rotateY(180deg) translateZ(60px);
          }

          .cube-right {
            background: linear-gradient(135deg, #10b981, #059669);
            border-color: #34d399;
            transform: rotateY(90deg) translateZ(60px);
          }

          .cube-left {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-color: #fbbf24;
            transform: rotateY(-90deg) translateZ(60px);
          }

          .cube-top {
            background: linear-gradient(135deg, #ec4899, #db2777);
            border-color: #f472b6;
            transform: rotateX(90deg) translateZ(60px);
          }

          .cube-bottom {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            border-color: #22d3ee;
            transform: rotateX(-90deg) translateZ(60px);
          }

          .cube-wrapper {
            animation: float 3s ease-in-out infinite;
          }
        `}
        </style>

        <div className="cube-wrapper">
          <div className="cube-3d">
            <div className="cube-face cube-front">⚡</div>
            <div className="cube-face cube-back">🚀</div>
            <div className="cube-face cube-right">💼</div>
            <div className="cube-face cube-left">🎨</div>
            <div className="cube-face cube-top">✨</div>
            <div className="cube-face cube-bottom">🔥</div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          {message}
        </h2>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};