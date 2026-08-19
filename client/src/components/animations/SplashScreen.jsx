import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Oscilloscope from '../electronics/Oscilloscope';
import CircuitBackground from '../electronics/CircuitBackground';

const STEPS = [
  { t: 'POWER ON', p: 8 },
  { t: 'INITIALIZING CORE', p: 22 },
  { t: 'LOADING MODULES', p: 40 },
  { t: 'CHECKING CIRCUITS', p: 58 },
  { t: 'LOADING PROJECT DATABASE', p: 78 },
  { t: 'SYSTEM READY', p: 100 },
];

export default function SplashScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (sessionStorage.getItem('ece_booted') === '1') {
      doneRef.current();
      return undefined;
    }
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, 520);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (step < STEPS.length - 1) return undefined;
    const t = setTimeout(() => finish(), 700);
    return () => clearTimeout(t);
  }, [step]);

  const finish = () => {
    sessionStorage.setItem('ece_booted', '1');
    setGone(true);
    setTimeout(onDone, 520);
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col bg-void text-ice"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5 }}
        >
          <CircuitBackground className="opacity-50" />
          <div className="scanlines absolute inset-0 opacity-40" />
          <div className="relative z-10 flex flex-1 flex-col justify-between px-6 py-8 md:px-12">
            <header className="flex items-center justify-between">
              <p className="font-mono text-[11px] tracking-[0.22em] text-cyan">SYS.ID ECE-001 · BOOT ROM</p>
              <button
                type="button"
                onClick={finish}
                className="font-mono text-[11px] tracking-[0.18em] text-mute hover:text-cyan"
              >
                SKIP INTRO
              </button>
            </header>

            <div className="mx-auto w-full max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.28em] text-pcb">« INITIALIZING SYSTEM… »</p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[0.14em] md:text-6xl">
                POWER ON
              </h1>
              <div className="mt-8 space-y-2">
                {STEPS.map((s, i) => (
                  <div key={s.t} className="flex items-center gap-3 font-mono text-xs tracking-[0.16em]">
                    <span className={i <= step ? 'text-pcb' : 'text-mute/40'}>{i <= step ? '●' : '○'}</span>
                    <span className={i === step ? 'text-cyan' : i < step ? 'text-ice/80' : 'text-mute/40'}>
                      {s.t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <div className="mb-2 flex justify-between font-mono text-[11px] tracking-[0.18em] text-mute">
                  <span>{current.t}</span>
                  <span>{String(current.p).padStart(3, '0')}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full bg-linear-to-r from-pcb via-cyan to-violet"
                    animate={{ width: `${current.p}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              <Oscilloscope className="mt-8 opacity-80" height={64} />
            </div>

            <footer className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-mute">
              <span>VOLTAGE 3.3V · FREQ 50Hz</span>
              <span>FIRMWARE 2026.08</span>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
