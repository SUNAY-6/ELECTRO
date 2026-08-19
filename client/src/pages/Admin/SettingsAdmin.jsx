import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';

export default function SettingsAdmin() {
  const { profile, settings, refresh } = usePortfolio();
  const [form, setForm] = useState({ ...profile });
  const [site, setSite] = useState({ ...settings });

  useEffect(() => {
    if (profile) setForm(profile);
    if (settings) setSite(settings);
  }, [profile, settings]);
  const [pw, setPw] = useState({ currentPassword: '', nextPassword: '' });
  const [msg, setMsg] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await api.upload(file);
    setForm((f) => ({ ...f, image: res.url }));
  };

  const save = async (e) => {
    e.preventDefault();
    await api.updateProfile({
      ...form,
      stats: {
        projects: Number(form.stats?.projects) || 0,
        technologies: Number(form.stats?.technologies) || 0,
        hardware: Number(form.stats?.hardware) || 0,
        achievements: Number(form.stats?.achievements) || 0,
      },
    });
    await api.updateSettings(site);
    await refresh();
    setMsg('Profile signal written.');
  };

  const changePw = async (e) => {
    e.preventDefault();
    await api.changePassword(pw.currentPassword, pw.nextPassword);
    setPw({ currentPassword: '', nextPassword: '' });
    setMsg('Access key rotated.');
  };

  return (
    <div>
      <p className="tech-label text-cyan">IDENTITY</p>
      <h1 className="font-display text-3xl">Portfolio Settings</h1>
      {msg && <p className="mt-3 font-mono text-xs text-pcb">{msg}</p>}

      <form onSubmit={save} className="glass mt-6 grid gap-4 rounded-sm p-5 md:grid-cols-2">
        {[
          ['name', 'NAME'],
          ['title', 'TITLE'],
          ['branch', 'BRANCH'],
          ['focus', 'FOCUS'],
          ['interest', 'INTEREST'],
          ['location', 'LOCATION'],
          ['education', 'EDUCATION'],
          ['educationDetail', 'EDUCATION DETAIL'],
          ['status', 'STATUS'],
          ['availability', 'AVAILABILITY'],
          ['email', 'EMAIL'],
          ['phone', 'PHONE'],
          ['github', 'GITHUB'],
          ['linkedin', 'LINKEDIN'],
          ['instagram', 'INSTAGRAM'],
          ['resumeUrl', 'RESUME URL'],
        ].map(([k, l]) => (
          <label key={k}>
            <span className="tech-label">{l}</span>
            <input value={form[k] || ''} onChange={set(k)} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
          </label>
        ))}
        <label className="md:col-span-2">
          <span className="tech-label">HEADLINE</span>
          <textarea value={form.headline || ''} onChange={set('headline')} rows={2} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <label className="md:col-span-2">
          <span className="tech-label">BIO</span>
          <textarea value={form.bio || ''} onChange={set('bio')} rows={3} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <label className="md:col-span-2">
          <span className="tech-label">LONG BIO</span>
          <textarea value={form.longBio || ''} onChange={set('longBio')} rows={4} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <label>
          <span className="tech-label">PROFILE IMAGE</span>
          <input type="file" accept="image/*" onChange={upload} className="mt-2 block text-xs" />
          {form.image && <img src={form.image} alt="" className="mt-2 size-20 object-cover" />}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['projects', 'technologies', 'hardware', 'achievements'].map((k) => (
            <label key={k}>
              <span className="tech-label">{k}</span>
              <input
                type="number"
                value={form.stats?.[k] ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, stats: { ...f.stats, [k]: e.target.value } }))}
                className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm"
              />
            </label>
          ))}
        </div>
        <label>
          <span className="tech-label">SITE TITLE</span>
          <input value={site.siteTitle || ''} onChange={(e) => setSite({ ...site, siteTitle: e.target.value })} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <label>
          <span className="tech-label">SITE DESCRIPTION</span>
          <input value={site.siteDescription || ''} onChange={(e) => setSite({ ...site, siteDescription: e.target.value })} className="mt-1 w-full border border-line bg-void/50 px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="bg-cyan px-4 py-2 font-mono text-[11px] text-void md:col-span-2">WRITE SETTINGS</button>
      </form>

      <form onSubmit={changePw} className="glass mt-6 grid max-w-lg gap-3 rounded-sm p-5">
        <p className="tech-label">ROTATE ACCESS KEY</p>
        <input type="password" placeholder="Current password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className="border border-line bg-void/50 px-3 py-2 text-sm" />
        <input type="password" placeholder="New password (8+)" value={pw.nextPassword} onChange={(e) => setPw({ ...pw, nextPassword: e.target.value })} className="border border-line bg-void/50 px-3 py-2 text-sm" />
        <button type="submit" className="border border-line px-4 py-2 font-mono text-[11px]">UPDATE PASSWORD</button>
      </form>
    </div>
  );
}
