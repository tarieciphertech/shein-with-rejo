import { motion } from 'framer-motion'

/** Shared editorial header for interior pages. */
export default function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="pt-32 pb-12 lg:pt-44 lg:pb-16">
      <div className="section-padding max-w-6xl mx-auto">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="eyebrow mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-ink dark:text-cream leading-[1.05] max-w-3xl"
        >
          {title}
        </motion.h1>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 text-lg text-charcoal/70 dark:text-cream/70 max-w-2xl leading-relaxed"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
