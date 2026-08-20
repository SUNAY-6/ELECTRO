import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { profile } = usePortfolio();
  const active = useScrollSpy(LINKS.map((l) => l.id));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 md:px-6">
      <nav
        className={`glass mx-auto flex max-w-6xl items-center justify-between rounded-sm px-4 py-2.5 transition-all ${
          scrolled ? 'border-cyan/25 shadow-[0_0_24px_var(--glow)]' : ''
        }`}
      >
        <button type="button" onClick={() => go('home')} className="flex items-center gap-3">
          <span className="grid size-8 place-items-center border border-cyan/40 font-display text-sm text-cyan">
            SUNAY
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-display text-sm tracking-[0.16em] uppercase">{profile?.name || 'ECE LAB'}</span>
            <span className="tech-label">SYS.ID ECE-001</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => go(l.id)}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors ${
                active === l.id ? 'text-cyan' : 'text-mute hover:text-ice'
              }`}
            >
              {active === l.id ? '▸ ' : ''}
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-pcb sm:flex">
            <span className="led" /> SYSTEM ONLINE
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid size-9 place-items-center border border-line text-mute hover:text-cyan"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center border border-line lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-sm p-3 lg:hidden">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => go(l.id)}
              className="block w-full px-3 py-2 text-left font-mono text-xs tracking-[0.16em] uppercase text-ice"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
