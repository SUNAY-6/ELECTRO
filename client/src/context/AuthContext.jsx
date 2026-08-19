import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTok] = useState(() => localStorage.getItem('ece_token'));
  const [user, setUser] = useState(() => (token ? { username: 'admin' } : null));
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    let alive = true;
    async function verify() {
      if (!token) {
        setUser(null);
        setChecking(false);
        return;
      }
      try {
        const { api } = await import('../services/api');
        const me = await api.me();
        if (alive) setUser(me);
      } catch {
        localStorage.removeItem('ece_token');
        if (alive) {
          setTok(null);
          setUser(null);
        }
      } finally {
        if (alive) setChecking(false);
      }
    }
    verify();
    return () => {
      alive = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      checking,
      isAuthed: Boolean(token && user),
      login: (nextToken, nextUser) => {
        localStorage.setItem('ece_token', nextToken);
        setTok(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem('ece_token');
        setTok(null);
        setUser(null);
      },
    }),
    [token, user, checking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
