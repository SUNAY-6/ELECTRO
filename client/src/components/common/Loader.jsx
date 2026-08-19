export default function Loader({ label = 'SYNCING MODULES…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-cyan">
      <svg viewBox="0 0 80 80" className="size-16">
        <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="40 140"
          className="origin-center animate-spin"
        />
        <circle cx="40" cy="40" r="4" fill="currentColor" />
      </svg>
      <p className="font-mono text-[11px] tracking-[0.22em]">{label}</p>
    </div>
  );
}
