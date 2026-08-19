import { useState } from 'react';
import { api } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';

const empty = {
  title: '',
  organization: '',
  description: '',
  date: new Date().toISOString().slice(0, 7),
  category: 'Award',
  certificateUrl: '',
  image: '',
};

export default function AchievementsAdmin() {
  const { achievements, refresh } = usePortfolio();
  const [form, setForm] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await api.upload(file);
    setForm((f) => ({ ...f, image: res.url, certificateUrl: res.url }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (form.id) await api.updateAchievement(form.id, form);
    else await api.createAchievement(form);
    await refresh();
    setForm(null);
  };

  const remove = async (id) => {
    if (!confirm('Delete this achievement node?')) return;
    await api.deleteAchievement(id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="tech-label text-cyan">TIMELINE</p>
          <h1 className="font-display text-3xl">Achievements</h1>
        </div>
        <button type="button" onClick={() => setForm({ ...empty })} className="bg-cyan px-4 py-2 font-mono text-[11px] text-void">
          ADD NODE
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="glass mt-6 grid gap-3 rounded-sm p-5 md:grid-cols-2">
          <Input label="TITLE" value={form.title} onChange={set('title')} />
          <Input label="ORGANIZATION" value={form.organization} onChange={set('organization')} />
          <label className="md:col-span-2">
            <span className="tech-label">DESCRIPTION</span>
            <textarea value={form.description} onChange={set('description')} rows={3} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
          </label>
          <Input label="DATE" value={form.date} onChange={set('date')} />
          <label>
            <span className="tech-label">CATEGORY</span>
            <select value={form.category} onChange={set('category')} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm">
              {['Hackathon', 'Certification', 'Internship', 'Award', 'Workshop', 'Academic', 'Competition'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <Input label="CERTIFICATE URL" value={form.certificateUrl} onChange={set('certificateUrl')} />
          <label>
            <span className="tech-label">UPLOAD CERT / IMAGE</span>
            <input type="file" accept="image/*" onChange={upload} className="mt-2 block text-xs" />
          </label>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-cyan px-4 py-2 font-mono text-[11px] text-void">SAVE</button>
            <button type="button" onClick={() => setForm(null)} className="border border-line px-4 py-2 font-mono text-[11px]">CANCEL</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {achievements.map((a) => (
          <article key={a.id} className="glass flex flex-col justify-between gap-3 rounded-sm p-4 md:flex-row md:items-center">
            <div>
              <p className="font-display text-lg">{a.title}</p>
              <p className="text-xs text-mute">{a.organization} · {a.date} · {a.category}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm(a)} className="border border-line px-3 py-1 font-mono text-[10px]">EDIT</button>
              <button type="button" onClick={() => remove(a.id)} className="border border-danger/40 px-3 py-1 font-mono text-[10px] text-danger">DELETE</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className="tech-label">{label}</span>
      <input {...props} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm outline-none focus:border-cyan" />
    </label>
  );
}
