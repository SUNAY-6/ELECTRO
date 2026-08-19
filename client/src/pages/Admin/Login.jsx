import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CircuitBackground from '../../components/electronics/CircuitBackground';
import Oscilloscope from '../../components/electronics/Oscilloscope';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.login(username, password);
      login(res.token, { username: res.username });
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Access denied.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-void px-4">
      <CircuitBackground className="opacity-40" />
      <form onSubmit={submit} className="glass relative z-10 w-full max-w-md rounded-sm p-8">
        <p className="tech-label text-cyan">SECURE UPLINK</p>
        <h1 className="font-display mt-2 text-3xl tracking-wide">LAB ACCESS</h1>
        <p className="mt-2 text-sm text-mute">Authenticate to manage the portfolio database.</p>
        <label className="tech-label mt-6 block">USERNAME</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm outline-none focus:border-cyan"
          autoComplete="username"
        />
        <label className="tech-label mt-4 block">PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm outline-none focus:border-cyan"
          autoComplete="current-password"
        />
        {error && <p className="mt-3 font-mono text-xs text-danger">⚠ {error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-cyan py-2.5 font-display tracking-[0.16em] text-void uppercase disabled:opacity-50"
        >
          {busy ? 'VERIFYING…' : 'UNLOCK CONSOLE'}
        </button>
        <Oscilloscope className="mt-6 opacity-70" height={48} />
      </form>
    </div>
  );
}
