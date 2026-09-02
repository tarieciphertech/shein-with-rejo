import { motion, useReducedMotion } from 'framer-motion'

/**
 * Editorial image reveal: a clip-path wipe with a gentle settle from 1.04 → 1.
 * Fires once on scroll into view. Reduced motion → simple fade.
 */
export default function RevealImage({
  src,
  alt,
  focal = '50% 50%',
  aspect = '4/3',
  className = '',
  imgClassName = '',
  caption,
  priority = false,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.figure
      initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', scale: 1.04, opacity: 0.4 }}
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { clipPath: 'inset(0 0 0% 0)', scale: 1, opacity: 1 }
      }
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={{ aspectRatio: aspect, objectPosition: focal }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {caption && (
        <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/70 to-transparent px-5 pt-12 pb-4 text-sm text-cream/90 font-medium">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
