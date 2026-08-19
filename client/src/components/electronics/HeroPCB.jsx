import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '../../hooks/useMedia';

const NODES = [
  { id: 'U1', x: 18, y: 22, kind: 'ic' },
  { id: 'U2', x: 62, y: 28, kind: 'ic' },
  { id: 'MCU', x: 42, y: 48, kind: 'mcu' },
  { id: 'J1', x: 10, y: 70, kind: 'conn' },
  { id: 'J2', x: 88, y: 18, kind: 'conn' },
  { id: 'R12', x: 28, y: 62, kind: 'pass' },
  { id: 'C3', x: 70, y: 58, kind: 'pass' },
  { id: 'Q1', x: 54, y: 16, kind: 'act' },
  { id: 'XTAL', x: 36, y: 16, kind: 'act' },
  { id: 'LDO', x: 80, y: 72, kind: 'ic' },
  { id: 'ANT', x: 90, y: 46, kind: 'rf' },
];

const TRACES = [
  ['U1', 'MCU'],
  ['U2', 'MCU'],
  ['MCU', 'J1'],
  ['MCU', 'C3'],
  ['U2', 'J2'],
  ['Q1', 'U2'],
  ['XTAL', 'U1'],
  ['R12', 'MCU'],
  ['LDO', 'C3'],
  ['ANT', 'U2'],
  ['J1', 'R12'],
  ['LDO', 'MCU'],
];

function nodeMap() {
  return Object.fromEntries(NODES.map((n) => [n.id, n]));
}

export default function HeroPCB() {
  const reduce = useReducedMotion();
  const map = useMemo(nodeMap, []);
  const [hot, setHot] = useState(null);
  const [auto, setAuto] = useState('MCU');
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (reduce || locked) return undefined;
    const id = setInterval(() => {
      setAuto((prev) => {
        const i = NODES.findIndex((n) => n.id === prev);
        return NODES[(i + 1) % NODES.length].id;
      });
    }, 1600);
    return () => clearInterval(id);
  }, [reduce, locked]);

  const activeId = hot || auto;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setMouse({ x, y });
    setLocked(true);
    let nearest = null;
    let best = 14;
    for (const n of NODES) {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < best) {
        best = d;
        nearest = n.id;
      }
    }
    setHot(nearest);
  };

  return (
    <div
      className="relative aspect-4/3 w-full overflow-hidden rounded-sm border border-line bg-ink/80"
      onMouseMove={onMove}
      onMouseLeave={() => {
        setHot(null);
        setLocked(false);
      }}
    >
      <div className="lab-grid absolute inset-0 opacity-70" />
      <div className="scan-sweep opacity-60" />
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x="2" y="2" width="96" height="76" fill="none" stroke="var(--line)" strokeWidth="0.3" />
        {TRACES.map(([a, b], i) => {
          const A = map[a];
          const B = map[b];
          const midX = (A.x + B.x) / 2;
          const d = `M${A.x} ${A.y} H${midX} V${B.y} H${B.x}`;
          const active = activeId === a || activeId === b;
          return (
            <g key={`${a}-${b}`}>
              <path d={d} fill="none" stroke={active ? 'var(--cyan)' : 'var(--line)'} strokeWidth={active ? 0.55 : 0.32} opacity={active ? 1 : 0.75} />
              {!reduce && (
                <>
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--pcb)"
                    strokeWidth="0.4"
                    strokeDasharray="2 10"
                    style={{ animation: `dashflow ${4.8 + (i % 3)}s linear infinite` }}
                    opacity={active ? 1 : 0.32}
                  />
                  <circle r="0.7" fill="var(--cyan)">
                    <animateMotion dur={`${3.4 + (i % 4) * 0.4}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </>
              )}
            </g>
          );
        })}
        {NODES.map((n) => {
          const active = activeId === n.id;
          const size = n.kind === 'mcu' ? 7.2 : n.kind === 'ic' ? 5.4 : 3.4;
          return (
            <g key={n.id}>
              {active && !reduce && (
                <circle cx={n.x} cy={n.y} r={size} fill="none" stroke="var(--cyan)" strokeOpacity="0.45" className="signal-orbit origin-center" style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
              )}
              <rect
                x={n.x - size / 2}
                y={n.y - size / 2}
                width={size}
                height={size}
                rx="0.4"
                fill={active ? 'color-mix(in srgb, var(--cyan) 18%, var(--bg))' : 'var(--panel-solid)'}
                stroke={active ? 'var(--cyan)' : 'var(--pcb)'}
                strokeWidth={active ? 0.45 : 0.28}
              />
              <circle cx={n.x} cy={n.y} r={active ? 0.9 : 0.55} fill={active ? 'var(--cyan)' : 'var(--pcb)'} />
              <text
                x={n.x}
                y={n.y + size / 2 + 2.4}
                textAnchor="middle"
                fill={active ? 'var(--cyan)' : 'var(--mute)'}
                fontSize="2.1"
                fontFamily="Share Tech Mono, monospace"
              >
                {n.id}
              </text>
            </g>
          );
        })}
        <circle cx={mouse.x} cy={mouse.y} r="7" fill="none" stroke="var(--cyan)" strokeOpacity="0.15" />
      </svg>
      <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] text-mute">
        MODULE · CORE-PCB
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 font-mono text-[10px] tracking-[0.16em] text-cyan live-voltage">
        {hot ? `PROBE → ${hot}` : `SCAN → ${auto}`}
      </div>
    </div>
  );
}
