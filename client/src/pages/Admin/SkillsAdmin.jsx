import { useState } from 'react';
import { api } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';

export default function SkillsAdmin() {
  const { skills, refresh } = usePortfolio();
  const [form, setForm] = useState({ name: '', category: 'Hardware', level: 80, description: '' });

  const add = async (e) => {
    e.preventDefault();
    await api.createSkill(form);
    setForm({ name: '', category: 'Hardware', level: 80, description: '' });
    await refresh();
  };

  const patch = async (id, body) => {
    await api.updateSkill(id, body);
    await refresh();
  };

  const remove = async (id) => {
    await api.deleteSkill(id);
    await refresh();
  };

  return (
    <div>
      <p className="tech-label text-cyan">ARSENAL</p>
      <h1 className="font-display text-3xl">Skills</h1>

      <form onSubmit={add} className="glass mt-6 grid gap-3 rounded-sm p-5 md:grid-cols-4">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-line bg-void/50 px-3 py-2 text-sm" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-line bg-void/50 px-3 py-2 text-sm">
          {['Hardware', 'Electronics', 'Software', 'Tools'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="number" min="1" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="border border-line bg-void/50 px-3 py-2 text-sm" />
        <button type="submit" className="bg-cyan font-mono text-[11px] text-void">ADD</button>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-line bg-void/50 px-3 py-2 text-sm md:col-span-4" />
      </form>

      <div className="mt-6 space-y-2">
        {skills.map((s) => (
          <div key={s.id} className="glass flex flex-col gap-2 rounded-sm p-3 md:flex-row md:items-center">
            <input defaultValue={s.name} onBlur={(e) => patch(s.id, { name: e.target.value })} className="flex-1 bg-transparent text-sm" />
            <select defaultValue={s.category} onChange={(e) => patch(s.id, { category: e.target.value })} className="bg-void text-xs">
              {['Hardware', 'Electronics', 'Software', 'Tools'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" defaultValue={s.level} onBlur={(e) => patch(s.id, { level: Number(e.target.value) })} className="w-16 bg-transparent text-sm" />
            <button type="button" onClick={() => remove(s.id)} className="font-mono text-[10px] text-danger">DEL</button>
          </div>
        ))}
      </div>
    </div>
  );
}
