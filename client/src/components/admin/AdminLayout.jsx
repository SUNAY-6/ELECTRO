import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Trophy,
  Cpu,
  Settings,
  Inbox,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: Boxes },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/skills', label: 'Skills', icon: Cpu },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const side = (
    <aside className="flex h-full flex-col border-r border-line bg-ink">
      <div className="border-b border-line px-4 py-4">
        <p className="font-display text-lg tracking-[0.16em]">LAB CONSOLE</p>
        <p className="tech-label mt-1">OPERATOR · {user?.username || 'admin'}</p>
      </div>
      <nav className="flex-1 p-2">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase ${
                isActive ? 'bg-cyan/10 text-cyan' : 'text-mute hover:text-ice'
              }`
            }
          >
            <l.icon size={14} /> {l.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/admin/login');
        }}
        className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-mute hover:text-danger"
      >
        <LogOut size={14} /> SIGN OUT
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-void text-ice lg:grid lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">{side}</div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-void/70" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="relative h-full w-64">{side}</div>
        </div>
      )}
      <div>
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-void/80 px-4 py-3 backdrop-blur">
          <button type="button" className="grid size-9 place-items-center border border-line lg:hidden" onClick={() => setOpen(true)}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <p className="font-mono text-[11px] tracking-[0.16em] text-pcb">
            <span className="led mr-2 inline-block align-middle" /> SYSTEM ONLINE
          </p>
          <Link to="/" className="font-mono text-[11px] tracking-[0.16em] text-cyan">
            VIEW PORTFOLIO →
          </Link>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
