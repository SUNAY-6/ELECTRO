import { motion } from 'framer-motion';

export default function SectionHeader({ kicker, title, subtitle, id }) {
  return (
    <div className="mb-10 md:mb-14">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="tech-label text-cyan"
      >
        {kicker}
      </motion.p>
      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-2 text-3xl font-semibold tracking-wide text-ice md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-mute md:text-base"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.18, duration: 0.5 }}
        className="mt-5 flex origin-left items-center gap-3"
      >
        <span className="h-px w-16 bg-linear-to-r from-cyan to-transparent" />
        <span className="size-1.5 rounded-full bg-pcb shadow-[0_0_10px_var(--pcb)] live-voltage" />
      </motion.div>
    </div>
  );
}
