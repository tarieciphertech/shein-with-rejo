import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { HiChevronLeft, HiChevronRight, HiPause, HiPlay } from 'react-icons/hi2'

const ease = [0.22, 1, 0.36, 1]

/**
 * Reusable, accessible image carousel.
 *
 * - autoplay with crossfade + subtle horizontal drift + gentle scale (cinematic)
 * - keyboard (←/→/space), swipe, prev/next, dots with progress, pause/play
 * - pauses on hover / focus / user interaction
 * - honours prefers-reduced-motion (plain crossfade, no autoplay)
 * - lazy-loads all but the first slide
 *
 * Pass `children` to overlay stable content above the slides (text, captions).
 */
export default function ImageCarousel({
  slides,
  autoplayMs = 5200,
  className = '',
  children,
  label = 'Featured images',
  renderControls = true,
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const touchStartX = useRef(null)
  const hoverRef = useRef(false)

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  )

  const effectivePaused = paused || hoverRef.current

  // Autoplay (disabled under reduced motion)
  useEffect(() => {
    if (effectivePaused || reduceMotion || slides.length <= 1) return undefined
    const id = setInterval(() => go(1), autoplayMs)
    return () => clearInterval(id)
  }, [effectivePaused, reduceMotion, autoplayMs, go, slides.length])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    else if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p) }
  }

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const slideVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, x: 70, scale: 1.07 },
        center: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -70, scale: 1.05 },
      }

  return (
    <div
      className={`group relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => { hoverRef.current = true }}
      onMouseLeave={() => { hoverRef.current = false }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            reduceMotion
              ? { duration: 0.7 }
              : { duration: 1.5, ease }
          }
          aria-hidden={slides.length > 1}
        >
          <img
            src={slides[index].src}
            alt={slides[index].alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            draggable="false"
            className="h-full w-full object-cover"
            style={{ objectPosition: slides[index].focal || '50% 50%' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Stable overlaid content (text, captions) — never re-animates with the image */}
      {children}

      {renderControls && slides.length > 1 && (
        <>
          {/* Progress dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`group/dot relative h-2.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-9 bg-clay-deep dark:bg-cream' : 'w-2.5 bg-ink/25 dark:bg-cream/30 hover:bg-ink/50'
                }`}
              >
                {i === index && (
                  <span
                    key={`progress-${index}`}
                    className="absolute inset-0 rounded-full bg-clay-deep dark:bg-cream"
                    style={{
                      transformOrigin: 'left',
                      animation: reduceMotion ? 'none' : `slideProgress ${autoplayMs}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-cream/80 dark:bg-ink/70 backdrop-blur-sm border border-ink/10 dark:border-cream/10 flex items-center justify-center text-ink dark:text-cream opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden md:flex"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-cream/80 dark:bg-ink/70 backdrop-blur-sm border border-ink/10 dark:border-cream/10 flex items-center justify-center text-ink dark:text-cream opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden md:flex"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>

          {/* Pause / play (top-right) */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            className="absolute right-4 top-4 z-20 w-10 h-10 rounded-full bg-cream/80 dark:bg-ink/70 backdrop-blur-sm border border-ink/10 dark:border-cream/10 flex items-center justify-center text-ink dark:text-cream"
          >
            {paused ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
          </button>
        </>
      )}
    </div>
  )
}
