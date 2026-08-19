import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../../components/common/SectionHeader';
import EmptyState from '../../components/common/EmptyState';
import { useIsTouch } from '../../hooks/useMedia';

const CATS = ['Hardware', 'Electronics', 'Software', 'Tools'];

export default function Skills() {
  const { skills } = usePortfolio();
  const [cat, setCat] = useState('Hardware');
  const touch = useIsTouch();
  const shown = useMemo(() => skills.filter((s) => s.category === cat), [skills, cat]);

  return (
    <section id="skills" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="MODULE · COMPONENT ANALYSIS"
          title="Technical Arsenal"
          subtitle="Hardware first, firmware close behind — the stack used to take a schematic from copper to a living system."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <motion.button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase ${
                cat === c ? 'bg-cyan text-void' : 'border border-line text-mute hover:text-ice'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>

        {shown.length === 0 ? (
          <EmptyState title="NO COMPONENT DATA" body="Skills will appear once they are added in the lab console." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((s, i) => (
                <SkillCard key={s.id} skill={s} index={i} tilt={!touch} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, index, tilt }) {
  const onMove = (e) => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-2px)`;
  };
  const reset = (e) => {
    e.currentTarget.style.transform = 'perspective(700px) rotateX(0) rotateY(0)';
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="group glass tilt-card relative overflow-hidden rounded-sm p-4 transition-transform duration-200"
    >
      <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100 circuit-run" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg tracking-wide">{skill.name}</h3>
        <span className="font-mono text-[11px] text-cyan">{skill.level}%</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-mute">{skill.description}</p>
      <div className="mt-4 h-1 overflow-hidden bg-line">
        <motion.div
          className="h-full bg-linear-to-r from-pcb to-cyan"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.article>
  );
}
