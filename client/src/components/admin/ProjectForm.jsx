import { useState } from 'react';
import { api } from '../../services/api';

const empty = {
  title: '',
  description: '',
  fullDescription: '',
  problem: '',
  solution: '',
  category: 'IoT',
  technologies: '',
  hardware: '',
  features: '',
  image: '',
  liveUrl: '',
  demoUrl: '',
  githubUrl: '',
  status: 'Completed',
  featured: false,
  date: new Date().toISOString().slice(0, 7),
};

export default function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...empty,
    ...initial,
    technologies: Array.isArray(initial?.technologies) ? initial.technologies.join(', ') : initial?.technologies || '',
    hardware: Array.isArray(initial?.hardware) ? initial.hardware.join(', ') : initial?.hardware || '',
    features: Array.isArray(initial?.features) ? initial.features.join(', ') : initial?.features || '',
  }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const res = await api.upload(file);
      setForm((f) => ({ ...f, image: res.url }));
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await onSave({
        ...form,
        technologies: form.technologies,
        hardware: form.hardware,
        features: form.features,
      });
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass space-y-4 rounded-sm p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="TITLE" value={form.title} onChange={set('title')} required />
        <label className="block">
          <span className="tech-label">CATEGORY</span>
          <select value={form.category} onChange={set('category')} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm">
            {['Embedded', 'IoT', 'ECE', 'EEE', 'Robotics', 'Web', 'AI', 'Hardware'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <Field label="SHORT DESCRIPTION" value={form.description} onChange={set('description')} required />
      <label className="block">
        <span className="tech-label">FULL DESCRIPTION</span>
        <textarea value={form.fullDescription} onChange={set('fullDescription')} rows={4} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="tech-label">PROBLEM</span>
          <textarea value={form.problem} onChange={set('problem')} rows={3} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="tech-label">SOLUTION</span>
          <textarea value={form.solution} onChange={set('solution')} rows={3} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
      </div>
      <Field label="TECHNOLOGIES (comma)" value={form.technologies} onChange={set('technologies')} />
      <Field label="HARDWARE (comma)" value={form.hardware} onChange={set('hardware')} />
      <Field label="FEATURES (comma)" value={form.features} onChange={set('features')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="LIVE URL" value={form.liveUrl} onChange={set('liveUrl')} />
        <Field label="DEMO URL" value={form.demoUrl} onChange={set('demoUrl')} />
        <Field label="GITHUB URL" value={form.githubUrl} onChange={set('githubUrl')} />
        <Field label="DATE (YYYY-MM)" value={form.date} onChange={set('date')} />
      </div>
      <label className="block">
        <span className="tech-label">STATUS</span>
        <select value={form.status} onChange={set('status')} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm">
          {['Completed', 'In Progress', 'Prototype'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured module
      </label>
      <div>
        <span className="tech-label">PROJECT IMAGE</span>
        <input type="file" accept="image/*" onChange={upload} className="mt-2 block text-xs" />
        {form.image && <img src={form.image} alt="" className="mt-3 h-28 object-cover" />}
      </div>
      {err && <p className="text-xs text-danger">{err}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="bg-cyan px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-void">
          {busy ? 'SAVING…' : 'SAVE MODULE'}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-4 py-2 font-mono text-[11px] tracking-[0.14em]">
          CANCEL
        </button>
      </div>
    </form>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="tech-label">{label}</span>
      <input {...props} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm outline-none focus:border-cyan" />
    </label>
  );
}
