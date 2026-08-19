export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass rounded-md px-6 py-12 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-danger">⚠ SIGNAL INTERRUPTED</p>
      <p className="mt-3 text-sm text-mute">{message || 'Unable to load data. Please try again.'}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 border border-line px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-cyan hover:border-cyan"
        >
          RETRY LINK
        </button>
      )}
    </div>
  );
}
