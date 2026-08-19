import { useEffect, useState } from 'react';
import { useIsTouch, useReducedMotion } from './useMedia';

export function useMouseParallax(strength = 12) {
  const touch = useIsTouch();
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (touch || reduce) return undefined;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x: x * strength, y: y * strength });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength, touch, reduce]);

  return offset;
}
