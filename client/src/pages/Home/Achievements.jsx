import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatMonth } from '../../utils/animations';
import SectionHeader from '../../components/common/SectionHeader';
import EmptyState from '../../components/common/EmptyState';

export default function Achievements() {
  const { achievements } = usePortfolio();
  const [active, setActive] = useState(achievements[0]?.id || null);
  const current = achievements.find((a) => a.id === active) || achievements[0];

  return (
    <section id="achievements" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="MODULE · SIGNAL TIMELINE"
          title="Achievements"
          subtitle="Nodes on a longer trace — competitions, internships, papers, and the certificates that marked a clean bring-up."
        />

        {achievements.length === 0 ? (
          <EmptyState title="NO ACHIEVEMENT DATA" body="Timeline nodes will light up once achievements are logged." />
        ) : (
          <>
            <div className="relative mb-10 overflow-x-auto pb-6">
              <div className="absolute top-3 right-0 left-0 h-px bg-line" />
              <motion.div
                className="absolute top-3 left-0 h-px origin-left bg-linear-to-r from-pcb via-cyan to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute top-[7px] size-2 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
                animate={{ left: ['0%', '92%', '0%'] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative flex min-w-max gap-10 px-2">
                {achievements.map((a, i) => {
                  const on = a.id === current?.id;
                  return (
                    <motion.button
                      key={a.id}
                      type="button"
                      onClick={() => setActive(a.id)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex w-36 flex-col items-center"
                    >
                      <span
                        className={`relative z-10 size-3 rounded-full transition-transform ${
                          on ? 'scale-125 bg-cyan shadow-[0_0_14px_var(--cyan)]' : 'bg-pcb/70'
                        }`}
                      />
                      <span className="mt-3 font-mono text-[10px] tracking-[0.16em] text-mute">
                        {formatMonth(a.date)}
                      </span>
                      <span className={`mt-1 text-center text-xs ${on ? 'text-cyan' : 'text-ice'}`}>{a.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {current && (
                <motion.article
                  key={current.id}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                  className="glass relative overflow-hidden rounded-sm p-6 md:p-8"
                >
                  <span className="absolute inset-x-0 top-0 h-px circuit-run" />
                  <p className="tech-label text-cyan">
                    {current.category} · {current.organization}
                  </p>
                  <h3 className="font-display mt-2 text-2xl md:text-3xl">{current.title}</h3>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-mute md:text-base">{current.description}</p>
                  {current.certificateUrl && (
                    <a
                      href={current.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-block font-mono text-[11px] tracking-[0.16em] text-cyan"
                    >
                      VIEW CERTIFICATE →
                    </a>
                  )}
                </motion.article>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
