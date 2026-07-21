import React, { useEffect, useState, useRef } from 'react';

/**
 * InitialLoader — Cinematic 3D-style app entry loader
 * Theme: Dark slate-blue bg + crimson red (#eb3b3b) accent + brutalist industrial
 * Shows once per session. Fades out and calls onComplete when done.
 */
export const InitialLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=boot, 1=load, 2=launch
  const [exiting, setExiting] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(Date.now());

  // Glitch effect fires randomly
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 600 + Math.random() * 1200;
      animRef.current = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 100);
        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
    return () => clearTimeout(animRef.current);
  }, []);

  // Progress engine: fast at start, slows mid, races to 100
  useEffect(() => {
    const duration = 2400; // ms total
    let raf;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Ease: fast → slow → fast curve
      const eased = t < 0.5
        ? 2 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const p = Math.round(eased * 100);
      setProgress(p);

      if (p < 35) setPhase(0);
      else if (p < 75) setPhase(1);
      else setPhase(2);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Exit
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete?.(), 600);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const phaseLabel = ['BOOTING SYSTEMS', 'SYNCING MODULES', 'LAUNCHING PORTFORGE'][phase];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background: 'hsl(222 47% 10%)',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.6s ease-in-out' : 'none',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(235,59,59,0.07) 0%, transparent 65%),
          linear-gradient(rgba(255,255,255,0.004) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.004) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        fontFamily: '"Bricolage Grotesque", "DM Sans", sans-serif',
      }}
    >
      <style>{`
        @keyframes il-rotate-slow { to { transform: rotate(360deg); } }
        @keyframes il-rotate-rev  { to { transform: rotate(-360deg); } }
        @keyframes il-pulse-ring  {
          0%,100% { opacity: 0.6; stroke-dashoffset: 0; }
          50%      { opacity: 1;   stroke-dashoffset: -40; }
        }
        @keyframes il-scanline {
          0%   { transform: translateY(-48px); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(48px); opacity: 0; }
        }
        @keyframes il-glow-pulse {
          0%,100% { box-shadow: 0 0 20px 4px rgba(235,59,59,0.15); }
          50%      { box-shadow: 0 0 50px 12px rgba(235,59,59,0.35); }
        }
        @keyframes il-glitch-h {
          0%   { clip-path: inset(0 0 92% 0); transform: translateX(-4px); }
          20%  { clip-path: inset(20% 0 60% 0); transform: translateX(4px); }
          40%  { clip-path: inset(55% 0 35% 0); transform: translateX(-2px); }
          60%  { clip-path: inset(80% 0 10% 0); transform: translateX(3px); }
          80%  { clip-path: inset(30% 0 55% 0); transform: translateX(-4px); }
          100% { clip-path: inset(5% 0 88% 0); transform: translateX(0); }
        }
        @keyframes il-corner-blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes il-progress-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes il-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes il-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .il-ring-1 {
          stroke-dasharray: 300;
          animation: il-pulse-ring 2s ease-in-out infinite;
          transform-origin: center;
        }
        .il-orbit-outer {
          animation: il-rotate-slow 8s linear infinite;
          transform-origin: center;
        }
        .il-orbit-inner {
          animation: il-rotate-rev 5s linear infinite;
          transform-origin: center;
        }
        .il-scanline-el {
          animation: il-scanline 1.8s ease-in-out infinite;
        }
        .il-logo-float {
          animation: il-float 3s ease-in-out infinite;
        }
        .il-glow-box {
          animation: il-glow-pulse 2s ease-in-out infinite;
        }
        .il-corner-dot {
          animation: il-corner-blink 1s ease-in-out infinite;
        }
        .il-ticker-inner {
          animation: il-ticker 18s linear infinite;
        }
        .il-shimmer {
          animation: il-progress-shimmer 1.4s linear infinite;
        }
      `}</style>

      {/* ── Corner brackets (brutalist frame) ── */}
      {[
        { top: 20, left: 20, rot: 0 },
        { top: 20, right: 20, rot: 90 },
        { bottom: 20, right: 20, rot: 180 },
        { bottom: 20, left: 20, rot: 270 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...pos,
            width: 28,
            height: 28,
            transform: `rotate(${pos.rot}deg)`,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: 2,
            background: '#eb3b3b',
            opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: 2, height: '100%',
            background: '#eb3b3b',
            opacity: 0.7,
          }} />
        </div>
      ))}

      {/* ── Scan line overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── Main 3D-style SVG orb ── */}
      <div className="relative il-logo-float" style={{ marginBottom: 40, zIndex: 2 }}>
        {/* Ambient glow halo */}
        <div className="il-glow-box" style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235,59,59,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          {/* ── Definitions ── */}
          <defs>
            <radialGradient id="il-sphere-grad" cx="38%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#2a3a5c" />
              <stop offset="60%" stopColor="#111d33" />
              <stop offset="100%" stopColor="#0d1527" />
            </radialGradient>
            <radialGradient id="il-inner-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eb3b3b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#eb3b3b" stopOpacity="0" />
            </radialGradient>
            <filter id="il-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <clipPath id="il-sphere-clip">
              <circle cx="80" cy="80" r="56" />
            </clipPath>
          </defs>

          {/* ── Outer orbit ring (rotating dots) ── */}
          <g className="il-orbit-outer" style={{ transformOrigin: '80px 80px' }}>
            <circle cx="80" cy="80" r="74" stroke="rgba(235,59,59,0.12)" strokeWidth="1" fill="none" strokeDasharray="4 8" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const r = 74, rad = (deg * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={80 + r * Math.cos(rad)}
                  cy={80 + r * Math.sin(rad)}
                  r={i % 2 === 0 ? 3 : 2}
                  fill={i % 2 === 0 ? '#eb3b3b' : 'rgba(235,59,59,0.4)'}
                />
              );
            })}
          </g>

          {/* ── Middle orbit ring ── */}
          <g className="il-orbit-inner" style={{ transformOrigin: '80px 80px' }}>
            <circle cx="80" cy="80" r="66" stroke="rgba(235,59,59,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="12 6" />
            {[30, 150, 270].map((deg, i) => {
              const r = 66, rad = (deg * Math.PI) / 180;
              return (
                <rect
                  key={i}
                  x={80 + r * Math.cos(rad) - 3}
                  y={80 + r * Math.sin(rad) - 3}
                  width="6" height="6"
                  fill="#eb3b3b"
                  opacity="0.6"
                  transform={`rotate(45, ${80 + r * Math.cos(rad)}, ${80 + r * Math.sin(rad)})`}
                />
              );
            })}
          </g>

          {/* ── Sphere body ── */}
          <circle cx="80" cy="80" r="56" fill="url(#il-sphere-grad)" />

          {/* Sphere inner glow */}
          <circle cx="80" cy="80" r="56" fill="url(#il-inner-grad)" />

          {/* Sphere border with brutal offset */}
          <circle cx="80" cy="80" r="56" stroke="#eb3b3b" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="83" cy="83" r="56" stroke="#eb3b3b" strokeWidth="0.5" fill="none" opacity="0.15" />

          {/* ── Latitude/longitude grid lines (3D illusion) ── */}
          <g clipPath="url(#il-sphere-clip)" opacity="0.15">
            {[-36, -18, 0, 18, 36].map((y, i) => (
              <ellipse key={i} cx="80" cy={80 + y} rx={Math.sqrt(56 * 56 - y * y)} ry="7"
                stroke="#7ec8e3" strokeWidth="0.5" fill="none" />
            ))}
            {[0, 30, 60, 90, 120, 150].map((deg, i) => (
              <ellipse key={i} cx="80" cy="80" rx="9" ry="56"
                stroke="#7ec8e3" strokeWidth="0.5" fill="none"
                transform={`rotate(${deg}, 80, 80)`} />
            ))}
          </g>

          {/* ── Scan line inside sphere ── */}
          <g clipPath="url(#il-sphere-clip)">
            <rect
              className="il-scanline-el"
              x="24" y="78" width="112" height="3"
              fill="#eb3b3b" opacity="0.5"
              rx="0"
            />
          </g>

          {/* ── Specular highlight (top-left shine) ── */}
          <ellipse cx="60" cy="58" rx="18" ry="10"
            fill="white" opacity="0.06"
            transform="rotate(-20, 60, 58)" />

          {/* ── Inner spinning ring ── */}
          <circle
            cx="80" cy="80" r="38"
            stroke="#eb3b3b" strokeWidth="1.5" fill="none"
            strokeDasharray="20 8" opacity="0.5"
            className="il-ring-1"
            style={{ transformOrigin: '80px 80px' }}
          />

          {/* ── Centre bolt icon ── */}
          <g filter="url(#il-glow)">
            <polygon
              points="86,58 73,80 82,80 74,102 95,76 84,76"
              fill="#eb3b3b"
              stroke="#eb3b3b"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </g>

          {/* ── Corner accents on sphere border ── */}
          {[[80, 24], [80, 136], [24, 80], [136, 80]].map(([cx, cy], i) => (
            <rect key={i} x={cx - 4} y={cy - 4} width="8" height="8"
              fill="#eb3b3b" opacity="0.9"
              transform={`rotate(45, ${cx}, ${cy})`}
            />
          ))}
        </svg>
      </div>

      {/* ── Brand name ── */}
      <div style={{ zIndex: 2, marginBottom: 6, position: 'relative' }}>
        {/* Glitch layer */}
        {glitch && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              color: '#eb3b3b',
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              animation: 'il-glitch-h 0.08s steps(1) forwards',
              opacity: 0.6,
              mixBlendMode: 'screen',
              zIndex: 3,
              userSelect: 'none',
            }}
          >
            Port<span style={{ color: '#fff' }}>Forge</span>
          </div>
        )}
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#fff',
          margin: 0,
          lineHeight: 1,
        }}>
          Port<span style={{ color: '#eb3b3b' }}>Forge</span>
        </h1>
      </div>

      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: 40,
        zIndex: 2,
      }}>
        Portfolio Generator for Developers
      </p>

      {/* ── Progress section ── */}
      <div style={{ width: 320, zIndex: 2 }}>
        {/* Phase label + percentage */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#eb3b3b',
          }}>
            {phaseLabel}
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.15em',
            color: '#fff',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(progress).padStart(3, '0')}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(235,59,59,0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Fill */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #a01515, #eb3b3b, #ff6b6b)',
            transition: 'width 0.1s linear',
          }} />
          {/* Shimmer */}
          <div
            className="il-shimmer"
            style={{
              position: 'absolute',
              top: 0, bottom: 0,
              width: '25%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            }}
          />
        </div>

        {/* Segment ticks */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          {[0, 25, 50, 75, 100].map((tick) => (
            <div key={tick} style={{
              width: 1,
              height: 4,
              background: progress >= tick ? '#eb3b3b' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Ticker tape ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 28,
        borderTop: '1px solid rgba(235,59,59,0.2)',
        background: 'rgba(13,21,39,0.8)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <div className="il-ticker-inner" style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          gap: '48px',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'rgba(235,59,59,0.6)',
          textTransform: 'uppercase',
        }}>
          {Array(4).fill([
            'PortForge v2.0', '◆', 'GitHub Sync', '◆', 'AI Portfolio', '◆',
            'Professional Templates', '◆', 'Real-time Insights', '◆',
            'Developer Ready', '◆',
          ]).flat().map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
