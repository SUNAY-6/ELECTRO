import { useId } from 'react';
import { useReducedMotion } from '../../hooks/useMedia';

const PATHS = [
  'M40 80 H180 V200 H320 V80 H460',
  'M80 40 V160 H240 V300 H400',
  'M20 240 H200 V360 H520',
  'M300 20 V140 H560 V260',
  'M120 420 H280 V280 H500 V420',
  'M600 60 V200 H720 V360',
  'M40 500 H220 V440 H380 V560',
];

export default function CircuitBackground({ className = '' }) {
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 760 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.0" />
          <stop offset="45%" stopColor="var(--cyan)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--pcb)" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--line)" strokeWidth="1.2" />
          <path
            d={d}
            fill="none"
            stroke={`url(#${id}-g)`}
            strokeWidth="1.6"
            strokeDasharray="18 220"
            style={{
              animation: reduce ? undefined : `dashflow ${7 + i}s linear infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        </g>
      ))}
      {[
        [180, 80],
        [320, 200],
        [240, 160],
        [200, 240],
        [560, 140],
        [280, 420],
        [720, 200],
        [220, 500],
      ].map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="3"
          fill="var(--cyan)"
          opacity="0.7"
          style={{
            animation: reduce ? undefined : `pulse-node ${2.4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            transformOrigin: `${x}px ${y}px`,
          }}
        />
      ))}
    </svg>
  );
}
