import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { Github } from '../common/BrandIcons';
import { useIsTouch } from '../../hooks/useMedia';
import { publicUrl } from '../../utils/publicUrl';

export default function ProjectCard({ project, index, onOpen }) {
  const img = publicUrl(project.image || '/images/projects/energy-monitor.jpg');
  const touch = useIsTouch();

  const onMove = (e) => {
    if (touch) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-6px)`;
  };
  const reset = (e) => {
    e.currentTarget.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ delay: Math.min(index, 8) * 0.05, type: 'spring', stiffness: 240, damping: 22 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="group circuit-border glass tilt-card relative flex flex-col overflow-hidden rounded-sm transition-transform duration-200"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 circuit-run" />
      <button type="button" onClick={() => onOpen(project)} className="text-left" data-cursor="OPEN MODULE →">
        <div className="relative flex items-center justify-between px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-mute">
          <span className="text-cyan">● SYSTEM {String(index + 1).padStart(2, '0')}</span>
          <span className={project.status === 'In Progress' ? 'text-amber live-voltage' : 'text-pcb'}>
            {project.status?.toUpperCase()}
          </span>
        </div>
        <div className="relative aspect-16/10 overflow-hidden bg-ink">
          <img
            src={img}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = publicUrl('/images/projects/energy-monitor.jpg');
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-void via-transparent to-transparent opacity-70" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="absolute inset-x-0 h-full bg-linear-to-b from-transparent via-cyan/20 to-transparent" style={{ animation: 'scan-sweep 2.4s ease-in-out infinite' }} />
          </span>
          {project.featured && (
            <span className="absolute top-3 left-3 border border-cyan/50 bg-void/70 px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-cyan">
              FEATURED
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl tracking-wide">{project.title}</h3>
          <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-cyan">
            {(project.technologies || []).slice(0, 4).join(' · ')}
          </p>
          <p className="mt-3 line-clamp-2 text-sm text-mute">{project.description}</p>
        </div>
      </button>
      <div className="mt-auto flex flex-wrap gap-2 px-4 pb-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.14em] hover:border-cyan hover:text-cyan"
          >
            <ExternalLink size={10} className="mr-1 inline" /> LIVE
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.14em] hover:border-cyan hover:text-cyan"
          >
            <Play size={10} className="mr-1 inline" /> DEMO
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.14em] hover:border-cyan hover:text-cyan"
          >
            <Github size={10} className="mr-1 inline" /> GITHUB
          </a>
        )}
      </div>
    </motion.article>
  );
}
