import { useEffect, useState } from 'react';

export function useMedia(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatch(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return match;
}

export function useReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

export function useIsTouch() {
  return useMedia('(pointer: coarse)');
}

export function useIsMobile() {
  return useMedia('(max-width: 767px)');
}
