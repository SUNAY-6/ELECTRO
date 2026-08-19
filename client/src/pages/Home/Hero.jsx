import { motion } from 'framer-motion';
import { ArrowRight, Download, Radio } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MagneticButton from '../../components/common/MagneticButton';
import CircuitBackground from '../../components/electronics/CircuitBackground';
import HeroPCB from '../../components/electronics/HeroPCB';
import Oscilloscope from '../../components/electronics/Oscilloscope';
import ScanLine from '../../components/animations/ScanLine';
import SignalParticles from '../../components/animations/SignalParticles';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { publicUrl } from '../../utils/publicUrl';

const LABELS = [
  { text: 'U3 · ESP32-WROOM', className: '-top-3 left-6 text-mute border-line', delay: 0 },
  { text: 'NET 3V3', className: 'top-1/3 -right-2 text-cyan border-cyan/30', delay: 0.15 },
  { text: 'SIG · 98%', className: 'bottom-24 left-2 text-pcb border-pcb/40', delay: 0.3 },
  { text: 'GPIO · BUS', className: 'top-8 right-10 text-violet border-violet/30', delay: 0.45 },
];

export default function Hero() {
  const { profile } = usePortfolio();
  const par = useMouseParallax(10);
  if (!profile) return null;

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const lines = (profile.headline || '').split('\n');

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28 pb-16">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${par.x * 0.35}px, ${par.y * 0.35}px, 0)` }}
      >
        <CircuitBackground className="opacity-45" />
      </div>
      <div className="lab-grid absolute inset-0 opacity-60" />
      <ScanLine className="opacity-40" />
      <SignalParticles />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-cyan/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pcb/8 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="tech-label text-pcb">
            {profile.branch} · {profile.location}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-mono text-[11px] tracking-[0.28em] text-cyan"
          >
            {profile.title?.toUpperCase()}
            <span className="caret" />
          </motion.p>
          <h1 className="font-display mt-2 text-4xl leading-[0.95] font-semibold tracking-wide md:text-6xl lg:text-7xl">
            {lines.map((line, li) => (
              <span key={line} className="block overflow-hidden">
                {line.split(' ').map((word, wi) => (
                  <motion.span
                    key={`${line}-${word}-${wi}`}
                    className="mr-[0.28em] inline-block text-glow"
                    initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.16 + li * 0.18 + wi * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base"
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {profile.tagline?.split('·').map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-cyan"
              >
                {s.trim().toUpperCase()}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton glow onClick={() => go('projects')} data-cursor="OPEN MODULES →">
              View Projects <ArrowRight size={14} />
            </MagneticButton>
            <MagneticButton href={publicUrl(profile.resumeUrl || '/resume.html')}>
              <Download size={14} /> Resume
            </MagneticButton>
            <MagneticButton onClick={() => go('contact')} data-cursor="ESTABLISH CONNECTION">
              <Radio size={14} /> Contact
            </MagneticButton>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
            {[
              ['NAME', profile.name],
              ['FOCUS', profile.focus],
              ['STATUS', profile.status],
              ['LOC', (profile.location || 'India').split(',')[0]],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.86 + i * 0.07 }}
                className="border border-line/80 px-3 py-2"
              >
                <p className="tech-label">{k}</p>
                <p className="mt-1 font-display text-sm tracking-wide">{v}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="will-change-transform"
            style={{ transform: `translate3d(${par.x * -0.4}px, ${par.y * -0.35}px, 0)` }}
          >
            {LABELS.map((l) => (
              <motion.span
                key={l.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + l.delay }}
                className={`pointer-events-none absolute z-10 border bg-void/80 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] float-drift ${l.className}`}
                style={{ animationDelay: `${l.delay}s` }}
              >
                {l.text}
              </motion.span>
            ))}
            <HeroPCB />
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-mute">
              <span className="live-voltage">SIGNAL 98% · VCC 3.3V</span>
              <span>PROBE ACTIVE</span>
            </div>
            <Oscilloscope className="mt-2" height={70} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
