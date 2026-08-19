import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { Github } from '../common/BrandIcons';
import { demoEmbed } from '../../utils/animations';
import { publicUrl } from '../../utils/publicUrl';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!project) return null;
  const embed = demoEmbed(project.demoUrl);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-void/80 p-4 backdrop-blur-md md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <motion.article
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="glass relative my-6 w-full max-w-4xl overflow-hidden rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center border border-line bg-void/70"
          aria-label="Close project"
        >
          <X size={16} />
        </button>
        <img
          src={publicUrl(project.image)}
          alt=""
          className="h-56 w-full object-cover md:h-72"
          onError={(e) => {
            e.currentTarget.src = publicUrl('/images/projects/energy-monitor.jpg');
          }}
        />
        <div className="p-5 md:p-8">
          <p className="tech-label text-cyan">
            {project.category} · {project.date} · {project.status}
          </p>
          <h3 className="font-display mt-2 text-3xl md:text-4xl">{project.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-mute md:text-base">{project.fullDescription}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {project.problem && (
              <div className="border border-line p-4">
                <p className="tech-label">PROBLEM</p>
                <p className="mt-2 text-sm">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="border border-line p-4">
                <p className="tech-label">SOLUTION</p>
                <p className="mt-2 text-sm">{project.solution}</p>
              </div>
            )}
          </div>

          {project.features?.length > 0 && (
            <div className="mt-6">
              <p className="tech-label">FEATURES</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="text-sm text-mute before:mr-2 before:text-pcb before:content-['▸']">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {(project.technologies || []).map((t) => (
              <span key={t} className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-cyan">
                {t}
              </span>
            ))}
          </div>
          {project.hardware?.length > 0 && (
            <p className="mt-3 text-xs text-mute">Hardware: {project.hardware.join(' · ')}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cyan px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-void">
                <ExternalLink size={12} /> LIVE
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[11px] tracking-[0.14em]">
                <Github size={12} /> GITHUB
              </a>
            )}
            {project.demoUrl && embed?.type === 'link' && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[11px] tracking-[0.14em]">
                <Play size={12} /> DEMO
              </a>
            )}
          </div>

          {embed && (embed.type === 'youtube' || embed.type === 'vimeo') && (
            <div className="mt-6 aspect-video overflow-hidden border border-line">
              <iframe
                title={`${project.title} demo`}
                src={embed.src}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {embed?.type === 'file' && (
            <video className="mt-6 w-full border border-line" src={embed.src} controls />
          )}
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  );
}
