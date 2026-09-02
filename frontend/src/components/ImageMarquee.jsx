import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Seamless, GPU-friendly fashion editorial rail.
 *
 * Uses a duplicated track driven by a pure CSS transform (see `marquee`
 * keyframe in tailwind.config) — no JS animation loop, no flicker, no reset.
 * Pauses on hover. Falls back to a static scrollable strip under
 * prefers-reduced-motion.
 */
export default function ImageMarquee({ items, speed = 70, className = '' }) {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef(null)

  const track = [...items, ...items]

  if (reduceMotion) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="flex gap-5 w-max px-2 py-1">
          {items.map((item, i) => (
            <figure key={i} className="shrink-0">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                style={{ aspectRatio: item.ratio || '3/4' }}
                className="h-44 sm:h-56 w-auto rounded-xl object-cover border border-sand/60 dark:border-white/10"
              />
            </figure>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused' }}
      onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }}
    >
      <div
        ref={trackRef}
        className="flex w-max animate-marquee gap-5 pr-5 will-change-transform"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((item, i) => (
          <figure
            key={i}
            className="group shrink-0 overflow-hidden rounded-xl border border-sand/60 dark:border-white/10"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                style={{ aspectRatio: item.ratio || '3/4' }}
                className="h-44 sm:h-56 w-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </div>
            <figcaption className="bg-white dark:bg-charcoal px-3.5 py-2.5 text-xs font-medium tracking-wide text-charcoal/70 dark:text-cream/70">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
