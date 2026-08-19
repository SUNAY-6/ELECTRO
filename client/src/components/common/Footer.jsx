import { usePortfolio } from '../../context/PortfolioContext';
import Oscilloscope from '../electronics/Oscilloscope';

export default function Footer() {
  const { profile, settings } = usePortfolio();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink px-6 py-10">
      <span className="absolute inset-x-0 top-0 h-px circuit-run opacity-70" />
      <div className="mx-auto max-w-6xl">
        <Oscilloscope height={48} className="mb-6 opacity-50" />
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg tracking-[0.14em] uppercase">{profile?.name}</p>
            <p className="tech-label mt-1">
              SYSTEM STATUS: <span className="text-pcb live-voltage">ONLINE</span> · LAST UPDATED: {settings?.lastUpdated || '2026'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.16em] text-mute">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-cyan">
                GITHUB
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan">
                LINKEDIN
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-cyan">
                EMAIL
              </a>
            )}
          </div>
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-mute">
          BUILT WITH REACT + VITE + EXPRESS · HARDWARE-INSPIRED INTERFACE · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
