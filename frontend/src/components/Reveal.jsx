import { motion, useReducedMotion } from 'framer-motion'

/**
 * Subtle scroll-reveal wrapper. Respects prefers-reduced-motion.
 * direction: 'up' | 'left' | 'right' | 'none'
 */
export default function Reveal({ children, delay = 0, direction = 'up', className, as = 'div', ...rest }) {
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 24
  const from = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }[direction]

  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
