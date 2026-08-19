import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useMedia';

export default function Oscilloscope({ className = '', height = 72, color }) {
  const canvas = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = canvas.current;
    if (!el) return undefined;
    const ctx = el.getContext('2d');
    let frame;
    let t = 0;
    const stroke = () => color || getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() || '#00e5ff';

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== w * dpr) {
        el.width = w * dpr;
        el.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'color-mix(in srgb, var(--line) 80%, transparent)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i += 1) {
        const y = (h / 4) * i + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = stroke();
      ctx.lineWidth = 1.6;
      ctx.shadowColor = stroke();
      ctx.shadowBlur = 8;
      for (let x = 0; x <= w; x += 2) {
        const n = Math.sin(x * 0.045 + t) * 0.55 + Math.sin(x * 0.11 + t * 1.7) * 0.22;
        const spike = Math.sin(x * 0.01 + t * 0.4) > 0.97 ? 0.5 : 0;
        const y = h / 2 - (n + spike) * (h * 0.38);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      t += reduce ? 0 : 0.08;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [color, reduce]);

  return <canvas ref={canvas} className={className} style={{ width: '100%', height }} aria-hidden />;
}
