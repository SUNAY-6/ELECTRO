import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../../components/common/SectionHeader';
import EmptyState from '../../components/common/EmptyState';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectModal from '../../components/projects/ProjectModal';
import SignalParticles from '../../components/animations/SignalParticles';

const FILTERS = ['All', 'Embedded', 'IoT', 'ECE', 'EEE', 'Robotics', 'Web', 'AI', 'Hardware'];

export default function Projects() {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);

  const shown = useMemo(() => {
    const list = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (filter === 'All') return list;
    return list.filter((p) => (p.category || '').toLowerCase() === filter.toLowerCase());
  }, [projects, filter]);

  return (
    <section id="projects" className="relative px-5 py-24 md:px-8">
      <SignalParticles count={4} />
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="MODULE · HARDWARE BAY"
          title="Projects"
          subtitle="Each card is a module — a board, a firmware story, and a problem that needed copper and code."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase ${
                filter === f ? 'bg-cyan text-void' : 'border border-line text-mute hover:text-ice'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {shown.length === 0 ? (
          <EmptyState
            title="NO PROJECT SIGNAL DETECTED"
            body="Projects will appear here once they are added from the lab console."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onOpen={setOpen} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
