import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsTouch } from '../../hooks/useMedia';

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled,
  glow = false,
  ...rest
}) {
  const ref = useRef(null);
  const touch = useIsTouch();

  const onMove = (e) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  const cls = `inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-display text-sm font-semibold tracking-[0.14em] uppercase transition-colors duration-200 ${
    glow
      ? 'bg-cyan text-void hover:brightness-110'
      : 'border border-line bg-panel/60 text-ice hover:border-cyan/50 hover:text-cyan'
  } ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`;

  const inner = (
    <span ref={ref} className="inline-flex items-center gap-2 transition-transform duration-150 ease-out">
      {children}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        onMouseMove={onMove}
        onMouseLeave={reset}
        whileTap={{ scale: 0.97 }}
        {...rest}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {inner}
    </motion.button>
  );
}
