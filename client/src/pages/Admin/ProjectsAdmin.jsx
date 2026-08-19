import { useState } from 'react';
import { api } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import ProjectForm from '../../components/admin/ProjectForm';
import { publicUrl } from '../../utils/publicUrl';

export default function ProjectsAdmin() {
  const { projects, refresh } = usePortfolio();
  const [mode, setMode] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const save = async (body) => {
    if (mode === 'new') await api.createProject(body);
    else await api.updateProject(mode.id, body);
    await refresh();
    setMode(null);
  };

  const remove = async (id) => {
    if (!confirm('Delete this project module?')) return;
    setBusyId(id);
    await api.deleteProject(id);
    await refresh();
    setBusyId(null);
  };

  const toggleFeatured = async (p) => {
    await api.updateProject(p.id, { featured: !p.featured });
    await refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="tech-label text-cyan">DATABASE</p>
          <h1 className="font-display text-3xl">Projects</h1>
        </div>
        <button type="button" onClick={() => setMode('new')} className="bg-cyan px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-void">
          ADD MODULE
        </button>
      </div>

      {mode && (
        <div className="mt-6">
          <ProjectForm initial={mode === 'new' ? null : mode} onSave={save} onCancel={() => setMode(null)} />
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {projects.map((p) => (
          <article key={p.id} className="glass flex flex-col gap-3 rounded-sm p-4 md:flex-row md:items-center">
            <img src={publicUrl(p.image)} alt="" className="h-20 w-32 object-cover" />
            <div className="flex-1">
              <p className="font-display text-lg">{p.title}</p>
              <p className="text-xs text-mute">
                {p.category} · {p.status} {p.featured ? '· FEATURED' : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => toggleFeatured(p)} className="border border-line px-3 py-1 font-mono text-[10px]">
                {p.featured ? 'UNFEATURE' : 'FEATURE'}
              </button>
              <button type="button" onClick={() => setMode(p)} className="border border-line px-3 py-1 font-mono text-[10px]">
                EDIT
              </button>
              <button
                type="button"
                disabled={busyId === p.id}
                onClick={() => remove(p.id)}
                className="border border-danger/40 px-3 py-1 font-mono text-[10px] text-danger"
              >
                DELETE
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
