// ═══════════════════════════════════════════════════════════════════════════════
//  30-Second Kinetic Status Video — Replit-ready
//  Install:  npm install framer-motion gsap
//  Usage:    Paste this as src/App.jsx  (or import as a component)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #000; overflow: hidden; }

@keyframes glitch1 {
  0%,100% { clip-path:inset(10% 0 80% 0); transform:translate(-10px, 2px) skewX(-5deg); }
  25%     { clip-path:inset(55% 0 25% 0); transform:translate( 10px,-2px) skewX( 4deg); }
  50%     { clip-path:inset(80% 0  5% 0); transform:translate( -5px, 6px) skewX(-3deg); }
  75%     { clip-path:inset(25% 0 65% 0); transform:translate(  5px,-6px) skewX( 3deg); }
}
@keyframes glitch2 {
  0%,100% { clip-path:inset(70% 0 10% 0); transform:translate( 10px,-2px) skewX( 4deg); }
  25%     { clip-path:inset(15% 0 70% 0); transform:translate(-10px, 2px) skewX(-4deg); }
  50%     { clip-path:inset( 5% 0 85% 0); transform:translate(  6px, 6px) skewX( 5deg); }
  75%     { clip-path:inset(60% 0 25% 0); transform:translate( -6px,-6px) skewX(-5deg); }
}
@keyframes scanline {
  from { top: -80px; }
  to   { top: 110%;  }
}
@keyframes neonFlicker {
  0%,93%,100% { opacity:1;   }
  94%         { opacity:0.55; }
  96%         { opacity:1;   }
  98%         { opacity:0.45; }
}
@keyframes shake {
  0%,100% { transform:translate(0,0) rotate(0deg); }
  10%     { transform:translate(-8px, 4px) rotate(-1deg); }
  20%     { transform:translate( 8px,-4px) rotate( 1deg); }
  30%     { transform:translate(-6px, 6px) rotate(-0.5deg); }
  40%     { transform:translate( 6px,-6px) rotate( 0.5deg); }
  60%     { transform:translate( 4px,-3px); }
  80%     { transform:translate( 2px,-2px); }
}

/* Chromatic-aberration glitch text */
.glitch { position:relative; display:inline-block; }
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute; top:0; left:0;
  width:100%; height:100%;
  font: inherit; letter-spacing: inherit;
  pointer-events: none;
}
.glitch::before { color:#ff003c; animation:glitch1 0.22s infinite linear; }
.glitch::after  { color:#00e5ff; animation:glitch2 0.22s infinite linear; }

.neon-flicker { animation:neonFlicker 4s linear infinite; }
.shake        { animation:shake 0.25s ease infinite; }

.scanline {
  position: absolute; left:0; right:0;
  height: 60px;
  background: linear-gradient(transparent, rgba(255,255,255,0.045), transparent);
  animation: scanline 4.5s linear infinite;
  pointer-events: none;
  z-index: 100;
}
`;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const SCENES = [
  {
    label: 'טבע',    sub: 'NATURE', color: '#00ff88',
    bg: 'linear-gradient(160deg, #020d04 0%, #0a2a10 100%)',
    glow: '#00ff4428',
  },
  {
    label: 'צחוקים', sub: 'LAUGHS', color: '#ffdd00',
    bg: 'linear-gradient(160deg, #120d00 0%, #2a1a00 100%)',
    glow: '#ffdd0028',
  },
  {
    label: 'טיולים', sub: 'TRIPS',  color: '#00aaff',
    bg: 'linear-gradient(160deg, #000a18 0%, #001428 100%)',
    glow: '#00aaff28',
  },
  {
    label: 'אקשן',   sub: 'ACTION', color: '#ff2244',
    bg: 'linear-gradient(160deg, #180003 0%, #280008 100%)',
    glow: '#ff224428',
  },
];

const HOOK_TEXTS = [
  { text: 'Yosef Yitzchak', from: 0.8, to: 2.3, size: 'clamp(52px,8.5vw,86px)',  color: '#ffffff', glitch: true  },
  { text: '15.5',           from: 2.4, to: 3.8, size: 'clamp(105px,16vw,150px)', color: '#ffdd00', glitch: false },
  { text: 'Beitar Illit',   from: 3.9, to: 5.2, size: 'clamp(48px,8vw,80px)',    color: '#ffffff', glitch: false },
  { text: 'Follow ↓',       from: 5.3, to: 6.5, size: 'clamp(72px,11.5vw,105px)', color: '#ff2244', glitch: true  },
];

const FLASH_COLORS = ['#ff003c', '#00aaff', '#ffdd00', '#00ff88', '#ff6600', '#aa00ff'];

/* ─────────────────────────────────────────────────────────────────────────────
   SPRING PRESETS
───────────────────────────────────────────────────────────────────────────── */
const SP_SMASH  = { type: 'spring', stiffness: 1100, damping: 11, mass: 1.8 };
const SP_BOUNCE = { type: 'spring', stiffness: 260,  damping: 5,  mass: 0.9 };

/* ─────────────────────────────────────────────────────────────────────────────
   HOOK: video timer (requestAnimationFrame, precision timing)
───────────────────────────────────────────────────────────────────────────── */
function useVideoTimer(totalSeconds = 30) {
  const [time, setTime]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef(null);
  const t0Ref  = useRef(null);

  const start = () => {
    cancelAnimationFrame(rafRef.current);
    t0Ref.current = performance.now();
    setTime(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const tick = (now) => {
      const t = (now - t0Ref.current) / 1000;
      if (t >= totalSeconds) { setTime(totalSeconds); setPlaying(false); return; }
      setTime(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, totalSeconds]);

  return { time, playing, start };
}

/* ─────────────────────────────────────────────────────────────────────────────
   CSS INJECTOR
───────────────────────────────────────────────────────────────────────────── */
function StyleTag({ css }) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: RapidImages — flashing color placeholders
───────────────────────────────────────────────────────────────────────────── */
function RapidImages({ fast }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIdx(i => (i + 1) % FLASH_COLORS.length),
      fast ? 130 : 420,
    );
    return () => clearInterval(id);
  }, [fast]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: FLASH_COLORS[idx],
      opacity: fast ? 0.45 : 0.18,
      zIndex: 0,
      transition: 'background 0.04s',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.88) 100%)',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: SmashText — spring-physics text entry
───────────────────────────────────────────────────────────────────────────── */
function SmashText({ text, color, size, glitch }) {
  const textStyle = {
    fontSize: size, color,
    fontFamily: "'Bebas Neue', 'Anton', sans-serif",
    letterSpacing: '0.05em', lineHeight: 1,
    textShadow: `0 0 18px ${color}80, 0 0 45px ${color}40`,
    display: 'block', whiteSpace: 'nowrap',
  };
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '92%', textAlign: 'center', zIndex: 20,
    }}>
      <motion.div
        initial={{ scale: 8,    opacity: 0, y: -130 }}
        animate={{ scale: 1,    opacity: 1, y: 0    }}
        exit={{   scale: 0.04, opacity: 0, y: 130,
                  transition: { duration: 0.09 } }}
        transition={SP_SMASH}
      >
        {glitch
          ? <span className="glitch" data-text={text} style={textStyle}>{text}</span>
          : <span style={textStyle}>{text}</span>
        }
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION: HookSection  (0 – 6 s)
───────────────────────────────────────────────────────────────────────────── */
function HookSection({ time }) {
  const rootRef  = useRef(null);
  const flashRef = useRef(null);

  // GSAP: massive zoom-in on mount + white flash burst
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(rootRef.current, { scale: 3.8, duration: 0.42, ease: 'power4.out' })
      .from(rootRef.current, { filter: 'blur(55px)', duration: 0.28 }, 0);

    gsap.timeline()
      .to(flashRef.current, { opacity: 0.9, duration: 0.04 })
      .to(flashRef.current, { opacity: 0,   duration: 0.04 })
      .to(flashRef.current, { opacity: 0.7, duration: 0.03 })
      .to(flashRef.current, { opacity: 0,   duration: 0.05 })
      .to(flashRef.current, { opacity: 0.4, duration: 0.04 })
      .to(flashRef.current, { opacity: 0,   duration: 0.3  });

    return () => tl.kill();
  }, []);

  // GSAP: random camera shake
  useEffect(() => {
    if (time > 5.5) return;
    const id = setInterval(() => {
      if (!rootRef.current) return;
      gsap.to(rootRef.current, {
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 9,
        duration: 0.04, yoyo: true, repeat: 1, ease: 'none',
        onComplete: () => gsap.set(rootRef.current, { x: 0, y: 0 }),
      });
    }, 290);
    return () => clearInterval(id);
  }, [time > 5.5]);

  const visibleTexts = HOOK_TEXTS.filter(({ from, to }) => time >= from && time < to);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.6, filter: 'blur(22px)', transition: { duration: 0.15 } }}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'linear-gradient(160deg, #08001a 0%, #14003a 60%, #000 100%)',
      }}
    >
      <RapidImages fast={time < 3} />

      {/* White flash overlay */}
      <div ref={flashRef} style={{
        position: 'absolute', inset: 0, background: '#fff',
        opacity: 0, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 30,
      }} />

      {/* Smash text sequence */}
      <AnimatePresence>
        {visibleTexts.map(({ text, size, color, glitch }) => (
          <SmashText key={text} text={text} color={color} size={size} glitch={glitch} />
        ))}
      </AnimatePresence>

      {/* Corner brackets */}
      {[
        { top: 30,    left: 30,  borderTop:    '3px solid #ffffff28', borderLeft:   '3px solid #ffffff28' },
        { top: 30,    right: 30, borderTop:    '3px solid #ffffff28', borderRight:  '3px solid #ffffff28' },
        { bottom: 30, left: 30,  borderBottom: '3px solid #ffffff28', borderLeft:   '3px solid #ffffff28' },
        { bottom: 30, right: 30, borderBottom: '3px solid #ffffff28', borderRight:  '3px solid #ffffff28' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 60, height: 60, ...s }} />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT: Particle — ambient floating dot
───────────────────────────────────────────────────────────────────────────── */
function Particle({ color }) {
  const x   = useMemo(() => Math.random() * 100, []);
  const y   = useMemo(() => Math.random() * 100, []);
  const sz  = useMemo(() => Math.random() * 5 + 2, []);
  const dur = useMemo(() => Math.random() * 3 + 2, []);
  return (
    <motion.div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: sz, height: sz, borderRadius: '50%', background: color,
      }}
      animate={{ y: [-20, -65, -20], opacity: [0, 0.7, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION: CoreScene  (6 – 26 s,  4 × 5 s)
───────────────────────────────────────────────────────────────────────────── */
function CoreScene({ scene, sceneTime }) {
  const rootRef = useRef(null);

  // GSAP: micro-heartbeat pulse after entry
  useEffect(() => {
    if (!rootRef.current) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 0.5 });
    tl.to(rootRef.current, { scale: 1.018, duration: 0.08, ease: 'power1.in'  })
      .to(rootRef.current, { scale: 1,     duration: 0.08, ease: 'power1.out' });
    return () => tl.kill();
  }, []);

  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);

  return (
    <motion.div
      ref={rootRef}
      /* Whip-pan entry from right */
      initial={{ x: '100%', skewX: '-12deg', filter: 'blur(18px)' }}
      animate={{ x: 0,      skewX: '0deg',   filter: 'blur(0px)'  }}
      transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
      /* Whip-pan exit to left */
      exit={{ x: '-100%', skewX: '12deg', filter: 'blur(18px)',
              transition: { duration: 0.14, ease: [0.8, 0, 1, 1] } }}
      style={{ position: 'absolute', inset: 0, background: scene.bg, overflow: 'hidden' }}
    >
      {/* Radial ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 85%, ${scene.glow} 0%, transparent 65%)`,
      }} />

      {/* Particles */}
      {particles.map(i => <Particle key={i} color={scene.color + '55'} />)}

      {/* Video placeholder frame */}
      <div style={{
        position: 'absolute', top: '12%', left: '6%', right: '6%', bottom: '32%',
        border: `1.5px solid ${scene.color}45`,
        borderRadius: 8,
        background: `${scene.color}08`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${scene.color}12 1px, transparent 1px),
                            linear-gradient(90deg, ${scene.color}12 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <span style={{
          color: `${scene.color}45`,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(20px,3.5vw,34px)',
          letterSpacing: '0.28em',
        }}>
          [ YOUR VIDEO ]
        </span>
      </div>

      {/* Neon title — bounce entry */}
      <motion.div
        initial={{ scale: 0.05, opacity: 0, y: 90, rotate: -8 }}
        animate={{ scale: 1,    opacity: 1, y: 0,  rotate: 0  }}
        transition={{ ...SP_BOUNCE, delay: 0.16 }}
        style={{
          position: 'absolute', bottom: '6%', left: 0, right: 0,
          textAlign: 'center', zIndex: 20, padding: '0 12px',
        }}
      >
        <div className="neon-flicker" style={{
          color: scene.color,
          fontFamily: "'Bebas Neue', 'Anton', sans-serif",
          fontSize: 'clamp(75px,13.5vw,125px)',
          letterSpacing: '0.1em', lineHeight: 1,
          direction: 'rtl',
          textShadow: `
            0 0 8px ${scene.color},
            0 0 25px ${scene.color},
            0 0 60px ${scene.color}90,
            0 0 100px ${scene.color}55`,
        }}>
          {scene.label}
        </div>
        <div style={{
          color: `${scene.color}75`,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(17px,3.2vw,26px)',
          letterSpacing: '0.6em', marginTop: -6,
        }}>
          {scene.sub}
        </div>
      </motion.div>

      {/* Scene progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 4, background: 'rgba(255,255,255,0.12)',
      }}>
        <motion.div
          animate={{ width: `${(sceneTime / 5) * 100}%` }}
          transition={{ duration: 0.08 }}
          style={{ height: '100%', background: scene.color, boxShadow: `0 0 8px ${scene.color}` }}
        />
      </div>

      {/* Corner accent lines */}
      {[
        { top: 36, left:  18, width: 70, height: 3  },
        { top: 36, left:  18, width: 3,  height: 70 },
        { top: 36, right: 18, width: 70, height: 3  },
        { top: 36, right: 18, width: 3,  height: 70 },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', background: scene.color,
          boxShadow: `0 0 10px ${scene.color}`, ...s,
        }} />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION: OutroSection  (26 – 30 s)
───────────────────────────────────────────────────────────────────────────── */
function OutroSection({ outroTime }) {
  const [flashIdx, setFlashIdx] = useState(0);
  const rootRef = useRef(null);

  // Rapid recap flashes (first 2.2 s of outro)
  useEffect(() => {
    if (outroTime > 2.2) return;
    const id = setInterval(() => setFlashIdx(i => (i + 1) % SCENES.length), 185);
    return () => clearInterval(id);
  }, [outroTime > 2.2]);

  // GSAP: slam to black
  useEffect(() => {
    if (outroTime < 2.2 || !rootRef.current) return;
    gsap.to(rootRef.current, { background: '#000', duration: 0.06 });
  }, [outroTime >= 2.2]);

  const scene   = SCENES[flashIdx];
  const showCTA = outroTime >= 2.2;

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: showCTA ? '#000' : scene.bg,
      }}
    >
      {/* Rapid recap labels */}
      <AnimatePresence>
        {!showCTA && (
          <motion.div
            key={flashIdx}
            initial={{ opacity: 0, scale: 1.45 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.07 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div className="shake" style={{
              fontSize: 'clamp(88px,17vw,160px)',
              color: scene.color,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.08em', lineHeight: 1,
              direction: 'rtl',
              textShadow: `0 0 14px ${scene.color}, 0 0 50px ${scene.color}90`,
            }}>
              {scene.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hard cut to black + CTA fade in */}
      {showCTA && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0, background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 28,
          }}
        >
          {/* Pulsing icon */}
          <motion.div
            animate={{ scale: [1, 1.07, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff2244, #ff7700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 54,
              boxShadow: '0 0 30px #ff224468, 0 0 80px #ff224428',
            }}
          >
            ❤️
          </motion.div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: '#fff',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(26px,5.5vw,44px)',
              letterSpacing: '0.55em', marginBottom: 10,
            }}>
              LIKE & FOLLOW
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(15px,2.8vw,22px)',
              letterSpacing: '0.32em',
            }}>
              @YosefYitzchak
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const { time, playing, start } = useVideoTimer(30);

  const phase      = time < 6  ? 'hook'  : time < 26 ? 'core' : 'outro';
  const sceneIndex = phase === 'core' ? Math.min(Math.floor((time - 6) / 5), 3) : 0;
  const sceneTime  = phase === 'core' ? (time - 6) - sceneIndex * 5 : 0;

  return (
    <>
      <StyleTag css={GLOBAL_CSS} />

      {/* Full-screen black canvas */}
      <div style={{
        width: '100vw', height: '100vh',
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* 1080 × 1920 aspect-ratio frame */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          width:  `min(100vw, calc(100vh * ${1080 / 1920}))`,
          height: `min(100vh, calc(100vw * ${1920 / 1080}))`,
        }}>
          {/* Scanline overlay */}
          <div className="scanline" />

          {/* Scene switcher — parallel entry/exit for whip-pan feel */}
          <AnimatePresence>
            {phase === 'hook'  && <HookSection  key="hook"          time={time}                              />}
            {phase === 'core'  && <CoreScene    key={`s${sceneIndex}`} scene={SCENES[sceneIndex]} sceneTime={sceneTime} />}
            {phase === 'outro' && <OutroSection key="outro"         outroTime={time - 26}                    />}
          </AnimatePresence>

          {/* ▶ Play overlay */}
          {!playing && (
            <div
              onClick={start}
              style={{
                position: 'absolute', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 18,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 88, height: 88, borderRadius: '50%',
                  border: '2.5px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 34, color: '#fff', paddingLeft: 6,
                }}
              >
                ▶
              </motion.div>
              <div style={{
                color: 'rgba(255,255,255,0.45)',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 17, letterSpacing: '0.4em',
              }}>
                PRESS TO PLAY
              </div>
            </div>
          )}

          {/* Rainbow progress bar */}
          {playing && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 3, zIndex: 300,
              background: 'rgba(255,255,255,0.14)',
            }}>
              <div style={{
                height: '100%',
                width: `${(time / 30) * 100}%`,
                background: 'linear-gradient(90deg, #ff2244, #ffdd00, #00ff88, #00aaff)',
                transition: 'width 0.05s linear',
                boxShadow: '0 0 6px rgba(255,255,255,0.5)',
              }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
