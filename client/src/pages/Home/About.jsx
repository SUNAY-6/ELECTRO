import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Cpu, GraduationCap, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useCountUp } from '../../hooks/useCountUp';
import SectionHeader from '../../components/common/SectionHeader';
import ScanLine from '../../components/animations/ScanLine';
import Reveal from '../../components/animations/Reveal';
import { publicUrl } from '../../utils/publicUrl';

function Stat({ label, value, enabled, delay }) {
  const n = useCountUp(value, enabled);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 220, damping: 20 }}
      className="glass rounded-sm p-4"
    >
      <p className="font-display text-3xl text-cyan md:text-4xl">{n}+</p>
      <p className="tech-label mt-1">{label}</p>
      <div className="mt-3 h-px overflow-hidden bg-line">
        <motion.div
          className="h-full bg-cyan"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}

export default function About() {
  const { profile } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  if (!profile) return null;

  return (
    <section id="about" className="relative px-5 py-24 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="MODULE · DIAGNOSTICS"
          title="Engineering Profile"
          subtitle="A compact readout of who is on the other side of the bench — training, focus, and the work already in copper."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-sm p-5"
          >
            <ScanLine className="opacity-50" />
            <p className="tech-label text-cyan">ENGINEERING PROFILE</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative">
                <img
                  src={publicUrl(profile.image)}
                  alt={profile.name}
                  className="size-24 rounded-sm object-cover ring-1 ring-cyan/30"
                />
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
                  <span className="absolute inset-x-0 h-1/3 bg-linear-to-b from-transparent via-cyan/25 to-transparent" style={{ animation: 'scan-sweep 3.6s ease-in-out infinite' }} />
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl">{profile.name}</h3>
                <p className="text-sm text-mute">{profile.title}</p>
                <p className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-pcb">
                  <span className="led" /> {(profile.status || 'ONLINE').toUpperCase()}
                </p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                [GraduationCap, 'Branch', profile.branch],
                [Cpu, 'Focus', profile.focus],
                [Sparkles, 'Interest', profile.interest],
                [MapPin, 'Location', profile.location],
              ].map(([Icon, k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i }}
                  className="flex gap-3 border-t border-line pt-3"
                >
                  <Icon size={15} className="mt-0.5 text-cyan" />
                  <div>
                    <dt className="tech-label">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                </motion.div>
              ))}
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-mute">{profile.education}</p>
          </motion.article>

          <div>
            <Reveal>
              <p className="text-sm leading-relaxed text-mute md:text-base">{profile.longBio}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 text-sm text-ice/90">
                Current availability: <span className="text-cyan">{profile.availability}</span>
              </p>
            </Reveal>
            <div ref={ref} className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Projects" value={profile.stats?.projects || 0} enabled={inView} delay={0} />
              <Stat label="Technologies" value={profile.stats?.technologies || 0} enabled={inView} delay={0.08} />
              <Stat label="Hardware Builds" value={profile.stats?.hardware || 0} enabled={inView} delay={0.16} />
              <Stat label="Achievements" value={profile.stats?.achievements || 0} enabled={inView} delay={0.24} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['EXPERIENCE', profile.experience],
                ['EDU NODE', profile.educationDetail || profile.education],
                ['SYS STATUS', profile.availability],
              ].map(([k, v], i) => (
                <Reveal key={k} delay={0.1 + i * 0.06}>
                  <div className="border border-line px-3 py-3">
                    <p className="tech-label">{k}</p>
                    <p className="mt-1 text-sm">{v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
