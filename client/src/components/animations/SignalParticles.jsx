import { useIsMobile, useReducedMotion } from '../../hooks/useMedia';

const DOTS = [
  { t: '12%', l: '8%', d: '0s', s: 4, c: 'var(--cyan)' },
  { t: '28%', l: '22%', d: '0.8s', s: 3, c: 'var(--pcb)' },
  { t: '18%', l: '78%', d: '1.4s', s: 5, c: 'var(--cyan)' },
  { t: '62%', l: '12%', d: '0.3s', s: 3, c: 'var(--violet)' },
  { t: '70%', l: '86%', d: '1.1s', s: 4, c: 'var(--pcb)' },
  { t: '44%', l: '64%', d: '1.8s', s: 3, c: 'var(--cyan)' },
  { t: '82%', l: '40%', d: '0.5s', s: 4, c: 'var(--amber)' },
  { t: '8%', l: '52%', d: '2s', s: 3, c: 'var(--pcb)' },
];

export default function SignalParticles({ count }) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  if (reduce) return null;
  const shown = DOTS.slice(0, count || (mobile ? 4 : DOTS.length));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {shown.map((d) => (
        <span
          key={`${d.t}-${d.l}`}
          className="absolute rounded-full"
          style={{
            top: d.t,
            left: d.l,
            width: d.s,
            height: d.s,
            background: d.c,
            boxShadow: `0 0 10px ${d.c}`,
            animation: `float-drift ${5 + shown.indexOf(d)}s ease-in-out ${d.d} infinite`,
          }}
        />
      ))}
    </div>
  );
}
