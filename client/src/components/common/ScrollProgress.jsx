import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-1/2 right-3 z-40 hidden h-40 w-3 -translate-y-1/2 md:block"
      aria-hidden
    >
      <div className="relative h-full w-px bg-line mx-auto overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-linear-to-b from-cyan to-pcb"
          style={{ height: `${Math.max(8, p * 100)}%` }}
        />
      </div>
      <div
        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]"
        style={{ top: `${p * 100}%` }}
      />
      <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-mute">
        {String(Math.round(p * 100)).padStart(2, '0')}%
      </span>
    </div>
  );
}
