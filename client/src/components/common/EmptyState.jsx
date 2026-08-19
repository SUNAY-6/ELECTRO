export default function EmptyState({ title = 'NO SIGNAL DETECTED', body = 'Nothing to display yet.' }) {
  return (
    <div className="glass rounded-md px-6 py-14 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-amber">⚠ {title}</p>
      <p className="mt-3 text-sm text-mute">{body}</p>
    </div>
  );
}
