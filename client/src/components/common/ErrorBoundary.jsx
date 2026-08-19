import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  static getDerivedStateFromError(err) {
    return { err };
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-void px-6 text-ice">
        <div className="glass max-w-md rounded-sm p-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-danger">⚠ SIGNAL INTERRUPTED</p>
          <p className="mt-3 text-sm text-mute">{this.state.err.message || 'The interface hit a fault.'}</p>
          <button
            type="button"
            className="mt-5 border border-line px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-cyan"
            onClick={() => window.location.reload()}
          >
            REBOOT UI
          </button>
        </div>
      </div>
    );
  }
}
