import React from 'react';

/**
 * PageLoader — Brutalist vector SVG loader
 * Matches the PortForge design system: dark bg, red accent, hard borders
 * Drop-in replacement for Loader3D — same prop API
 */
export const Loader3D = ({ message = 'Loading...' }) => {
  return (
    <div
      style={{ fontFamily: '"JetBrains Mono", "Fira Mono", monospace' }}
      className="flex flex-col items-center justify-center min-h-screen bg-background"
    >
      {/* SVG Vector Mark */}
      <div className="relative mb-10">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <style>{`
            @keyframes pf-spin {
              to { stroke-dashoffset: -502; }
            }
            @keyframes pf-scan {
              0%, 100% { transform: translateY(0px);   opacity: 1; }
              50%       { transform: translateY(64px);  opacity: 0.4; }
            }
            @keyframes pf-pulse {
              0%, 100% { opacity: 1;   transform: scale(1); }
              50%       { opacity: 0.5; transform: scale(0.92); }
            }
            @keyframes pf-blink {
              0%, 49% { opacity: 1; }
              50%, 100%{ opacity: 0; }
            }
            .pf-ring {
              stroke-dasharray: 251;
              stroke-dashoffset: 0;
              animation: pf-spin 1.4s cubic-bezier(0.6,0,0.4,1) infinite;
              transform-origin: 48px 48px;
            }
            .pf-ring-outer {
              stroke-dasharray: 502;
              stroke-dashoffset: 0;
              animation: pf-spin 2.2s linear infinite reverse;
              transform-origin: 48px 48px;
            }
            .pf-bolt {
              animation: pf-pulse 1.4s ease-in-out infinite;
              transform-origin: 48px 48px;
            }
            .pf-scanline {
              animation: pf-scan 1.4s ease-in-out infinite;
            }
          `}</style>

          {/* Outer hard-border square with offset shadow (brutalist frame) */}
          <rect
            x="4" y="8"
            width="88" height="88"
            fill="none"
            stroke="#111111"
            strokeWidth="3"
          />
          {/* Offset shadow rectangle */}
          <rect
            x="8" y="12"
            width="88" height="88"
            fill="none"
            stroke="#111111"
            strokeWidth="1.5"
            opacity="0.25"
          />

          {/* Dark fill */}
          <rect x="4" y="8" width="88" height="88" fill="#0d0d0d" />

          {/* Outer spinning ring */}
          <circle
            cx="48" cy="52"
            r="32"
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="6"
          />
          <circle
            cx="48" cy="52"
            r="32"
            fill="none"
            stroke="#eb3b3b"
            strokeWidth="3"
            strokeLinecap="square"
            className="pf-ring-outer"
          />

          {/* Inner spinning ring */}
          <circle
            cx="48" cy="52"
            r="20"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
          />
          <circle
            cx="48" cy="52"
            r="20"
            fill="none"
            stroke="#eb3b3b"
            strokeWidth="2"
            strokeLinecap="square"
            strokeDasharray="30 100"
            className="pf-ring"
          />

          {/* Scan line clipped inside circle */}
          <clipPath id="pf-clip">
            <circle cx="48" cy="52" r="19" />
          </clipPath>
          <rect
            x="29" y="52"
            width="38" height="2"
            fill="#eb3b3b"
            opacity="0.5"
            className="pf-scanline"
            clipPath="url(#pf-clip)"
          />

          {/* Centre bolt SVG path */}
          <g className="pf-bolt">
            <polygon
              points="52,36 42,52 49,52 44,68 56,50 49,50"
              fill="#eb3b3b"
              stroke="#eb3b3b"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </g>

          {/* Corner tick marks — brutalist detail */}
          {[[4,8],[92,8],[4,96],[92,96]].map(([cx,cy], i) => (
            <rect key={i} x={cx-3} y={cy-3} width="6" height="6" fill="#eb3b3b" />
          ))}
        </svg>
      </div>

      {/* Text block */}
      <div className="text-center max-w-xs px-4">
        <div
          className="text-xs font-black uppercase tracking-[0.3em] text-white mb-4"
          style={{ fontFamily: 'inherit' }}
        >
          Port<span className="text-primary">Forge</span>
        </div>

        <div
          className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6"
          style={{ fontFamily: 'inherit' }}
        >
          {message}
        </div>

        {/* Brutalist progress bar */}
        <div className="w-48 mx-auto border-2 border-border bg-card h-2 relative overflow-hidden">
          <style>{`
            @keyframes pf-bar {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            .pf-bar-fill { animation: pf-bar 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
          `}</style>
          <div className="pf-bar-fill absolute inset-y-0 w-1/2 bg-primary" />
        </div>
      </div>
    </div>
  );
};