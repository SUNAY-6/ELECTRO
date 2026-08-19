import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, FileDown } from 'lucide-react';
import { Github, Linkedin, Instagram } from '../../components/common/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { api } from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';
import MagneticButton from '../../components/common/MagneticButton';
import Oscilloscope from '../../components/electronics/Oscilloscope';
import { publicUrl } from '../../utils/publicUrl';

const PHASES = ['IDLE', 'CONNECTING…', 'TRANSMITTING…', 'SIGNAL SENT ✓'];

export default function Contact() {
  const { profile } = usePortfolio();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState(0);
  const [fail, setFail] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFail('');
    setPhase(1);
    try {
      setTimeout(() => setPhase(2), 280);
      await api.contact(form);
      setPhase(3);
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setPhase(0), 2600);
    } catch (err) {
      setPhase(0);
      setErrors(err.payload?.errors || {});
      setFail(err.message || 'Transmission failed.');
    }
  };

  if (!profile) return null;

  const links = [
    profile.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    profile.github && { icon: Github, label: 'GitHub', href: profile.github },
    profile.linkedin && { icon: Linkedin, label: 'LinkedIn', href: profile.linkedin },
    profile.instagram && { icon: Instagram, label: 'Instagram', href: profile.instagram },
    profile.resumeUrl && { icon: FileDown, label: 'Resume', href: publicUrl(profile.resumeUrl) },
  ].filter(Boolean);

  return (
    <section id="contact" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="MODULE · COMMUNICATION TERMINAL"
          title="Establish Connection"
          subtitle="Drop a packet. If the idea is interesting — a board, a role, a collaboration — the link will open."
        />

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 6 }}
                className="glass flex items-center gap-3 rounded-sm px-4 py-3 hover:border-cyan/40"
                data-cursor="ESTABLISH CONNECTION"
              >
                <l.icon size={16} className="text-cyan" />
                <span className="text-sm">{l.label}</span>
              </motion.a>
            ))}
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass relative overflow-hidden rounded-sm p-5 md:p-7"
          >
            <span className="absolute inset-x-0 top-0 h-px circuit-run" />
            <p className="tech-label text-cyan">
              UPLINK · CONTACT FORM
              <span className="caret ml-2" />
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="NAME" value={form.name} onChange={set('name')} error={errors.name} />
              <Field label="EMAIL" type="email" value={form.email} onChange={set('email')} error={errors.email} />
            </div>
            <div className="mt-4">
              <Field label="SUBJECT" value={form.subject} onChange={set('subject')} error={errors.subject} />
            </div>
            <div className="mt-4">
              <label className="tech-label">MESSAGE</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={set('message')}
                className="mt-1 w-full resize-y border border-line bg-void/40 px-3 py-2 text-sm outline-none transition-colors focus:border-cyan"
              />
              {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
            </div>
            {fail && <p className="mt-3 font-mono text-xs text-danger">⚠ {fail}</p>}
            <div className="mt-4 h-1 overflow-hidden bg-line">
              <motion.div
                className="h-full bg-linear-to-r from-pcb via-cyan to-violet"
                animate={{ width: ['0%', '28%', '72%', '100%'][phase] || '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <MagneticButton type="submit" glow disabled={phase > 0}>
                {phase === 0 ? 'TRANSMIT MESSAGE' : PHASES[phase]}
              </MagneticButton>
              <span className="font-mono text-[10px] tracking-[0.16em] text-mute live-voltage">{PHASES[phase]}</span>
            </div>
            {phase > 0 && <Oscilloscope className="mt-4 opacity-80" height={44} />}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, type = 'text' }) {
  return (
    <div>
      <label className="tech-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border border-line bg-void/40 px-3 py-2 text-sm outline-none transition-colors focus:border-cyan"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
