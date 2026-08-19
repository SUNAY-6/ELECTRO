import { useEffect, useRef } from 'react';
import { useIsTouch, useReducedMotion } from '../../hooks/useMedia';

export default function CursorEffect() {
  const touch = useIsTouch();
  const reduce = useReducedMotion();
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (touch || reduce) return undefined;
    document.body.classList.add('cursor-none');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let label = '';

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target.closest('[data-cursor]');
      label = t?.dataset.cursor || '';
      const interactive = e.target.closest('a,button,input,textarea,select,[role="button"]');
      if (ring.current) ring.current.dataset.hot = interactive ? '1' : '0';
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
        const tag = ring.current.querySelector('[data-tag]');
        if (tag) tag.textContent = label;
      }
      frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);
    window.addEventListener('mousemove', move);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('cursor-none');
    };
  }, [touch, reduce]);

  if (touch || reduce) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[80] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan mix-blend-difference"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[80] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="size-9 rounded-full border border-cyan/50 transition-transform duration-200 [[data-hot='1']_&]:scale-150 [[data-hot='1']_&]:border-pcb" />
        <span
          data-tag
          className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.18em] text-cyan"
        />
      </div>
    </>
  );
}
