import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { api } from '../../services/api';

export default function Dashboard() {
  const { projects, achievements, skills, stats, profile } = usePortfolio();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api
      .messages()
      .then((m) => setUnread(m.filter((x) => !x.read).length))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Projects', value: projects.length, to: '/admin/projects' },
    { label: 'Achievements', value: achievements.length, to: '/admin/achievements' },
    { label: 'Skills', value: skills.length, to: '/admin/skills' },
    { label: 'Profile Views', value: stats?.views ?? 0, to: '/admin/settings' },
    { label: 'Unread Messages', value: unread, to: '/admin/messages' },
  ];

  return (
    <div>
      <p className="tech-label text-cyan">OVERVIEW</p>
      <h1 className="font-display mt-1 text-3xl">Command Deck</h1>
      <p className="mt-2 text-sm text-mute">Welcome back. {profile?.name} is currently {profile?.status?.toLowerCase()}.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="glass rounded-sm p-4 hover:border-cyan/40">
            <p className="tech-label">{c.label}</p>
            <p className="font-display mt-2 text-3xl text-cyan">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-sm p-5">
          <p className="tech-label">FEATURED MODULES</p>
          <ul className="mt-3 space-y-2">
            {projects
              .filter((p) => p.featured)
              .map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{p.title}</span>
                  <span className="text-mute">{p.category}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="glass rounded-sm p-5">
          <p className="tech-label">SKILL SPREAD</p>
          <ul className="mt-3 space-y-2">
            {['Hardware', 'Electronics', 'Software', 'Tools'].map((c) => (
              <li key={c} className="flex justify-between text-sm">
                <span>{c}</span>
                <span className="text-cyan">{skills.filter((s) => s.category === c).length}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
