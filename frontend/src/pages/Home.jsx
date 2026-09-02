import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi2'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'
import ImageCarousel from '../components/ImageCarousel'
import ImageMarquee from '../components/ImageMarquee'
import RevealImage from '../components/RevealImage'
import { images } from '../data/images'
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '../config'
import { journeySteps } from '../data/content'

const ease = [0.22, 1, 0.36, 1]

function HeroSlide({ hero }) {
  return (
    <section className="relative min-h-[84vh] sm:min-h-[86vh] lg:min-h-[92vh] overflow-hidden bg-linen dark:bg-ink">
      <ImageCarousel
        slides={hero}
        autoplayMs={5200}
        className="!absolute inset-0 h-full"
        label="SHEIN with Rejo — campaign imagery"
      >
        {/* Stable readability overlays — they do not move with the image */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/55 to-transparent dark:from-ink/90 dark:via-ink/45 dark:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-cream/90 via-transparent to-cream/30 dark:from-ink/95 dark:to-ink/30"
          aria-hidden="true"
        />

        {/* Stable brand message */}
        <div className="absolute inset-0 flex items-center">
          <div className="section-padding w-full">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl pt-28 pb-24 lg:pt-36 lg:pb-32">
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="eyebrow mb-5"
                >
                  SHEIN ordering service · Harare
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease }}
                  className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.4rem] font-medium text-ink dark:text-cream"
                >
                  See it on SHEIN?
                  <br />
                  <span className="italic text-clay">Rejo can help you get it.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16, ease }}
                  className="mt-6 text-lg text-charcoal/75 dark:text-cream/75 leading-relaxed max-w-lg"
                >
                  Send us the link or a screenshot of what you've found. We'll help you
                  through the ordering process and place your request in our next
                  ordering cycle — every {BUSINESS.orderingCycleDays} days.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.24, ease }}
                  className="mt-9 flex flex-col sm:flex-row gap-3.5"
                >
                  <Link to="/submit-order" className="btn-accent">
                    Send a SHEIN Request
                    <HiArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/how-it-works" className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink">
                    How It Works
                  </Link>
                </motion.div>

                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal/70 dark:text-cream/70"
                >
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay" aria-hidden="true" />
                    Orders every {BUSINESS.orderingCycleDays} days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay" aria-hidden="true" />
                    Free delivery in Harare
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay" aria-hidden="true" />
                    No SHEIN account needed
                  </li>
                </motion.ul>
              </div>
            </div>
          </div>
        </div>
      </ImageCarousel>
    </section>
  )
}

function MeetRejo() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-padding max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Photo placeholder — swap with an authentic photo of Rejo when available */}
          <Reveal direction="right" className="lg:col-span-2">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-linen dark:bg-white/5 border border-sand dark:border-white/10 flex flex-col items-center justify-center gap-4 p-8">
                <span className="w-24 h-24 rounded-full bg-ink dark:bg-cream text-cream dark:text-ink flex items-center justify-center font-display text-5xl font-medium" aria-hidden="true">R</span>
                <p className="font-display italic text-xl text-charcoal/70 dark:text-cream/70 text-center">Photo coming soon</p>
                <p className="text-xs text-charcoal/40 dark:text-cream/40 text-center max-w-[200px]">
                  A real photo of Rejo will live here — no stock photos, no filters.
                </p>
              </div>
              <span className="absolute -bottom-4 -right-3 bg-clay text-white text-xs font-semibold uppercase tracking-widest2 px-4 py-2 rounded-full rotate-2">
                Your shopper in Harare
              </span>
            </div>
          </Reveal>

          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow mb-4">Meet Rejo</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-ink dark:text-cream leading-tight text-balance">
                “Shopping online should be exciting — <span className="italic text-clay">not confusing.</span>”
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-charcoal/70 dark:text-cream/70 leading-relaxed max-w-xl">
                <p>
                  That's the whole idea behind SHEIN with Rejo. You find the piece — the dress, the sneakers, the little something for the kids. Then the hard part starts: international cards, shipping that doesn't reach Zimbabwe, sizes you're not sure about.
                </p>
                <p>
                  Rejo takes that part over. You send what you found, she checks the details, places your order in the next cycle, and gets it to your door in Harare.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href={whatsappLink(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink"
                >
                  Ask Rejo a question
                </a>
                <Link to="/about" className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-medium text-clay-deep dark:text-clay hover:underline underline-offset-4">
                  More about the service
                  <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function JourneySection() {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-charcoal">
      <div className="section-padding max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-14 lg:mb-20">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-ink dark:text-cream leading-tight">
            From “I want this” to <span className="italic text-clay">“It's on its way.”</span>
          </h2>
        </Reveal>

        <ol className="relative">
          {journeySteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.number}
              delay={index * 0.04}
              className="relative grid sm:grid-cols-12 gap-4 sm:gap-8 py-8 lg:py-10 border-t border-sand dark:border-white/10 last:border-b"
            >
              <div className="sm:col-span-2">
                <span className="font-display text-4xl lg:text-5xl italic text-clay/40 dark:text-clay/60">{step.number}</span>
              </div>
              <div className="sm:col-span-4">
                <h3 className="text-xl lg:text-2xl font-semibold text-ink dark:text-cream">{step.title}</h3>
                <p className="mt-1.5 text-charcoal/60 dark:text-cream/60">{step.description}</p>
              </div>
              <div className="sm:col-span-6">
                <p className="text-charcoal/70 dark:text-cream/70 leading-relaxed sm:pt-1">{step.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1} className="mt-12">
          <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-clay-deep dark:text-clay hover:underline underline-offset-4">
            See the full step-by-step guide
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function CycleSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-padding max-w-6xl mx-auto">
        <div className="card-dark p-8 sm:p-14 lg:p-20 relative overflow-hidden">
          <div
            className="absolute -right-10 -top-10 font-display italic font-medium text-[16rem] lg:text-[22rem] leading-none text-white/[0.04] select-none pointer-events-none"
            aria-hidden="true"
          >
            {BUSINESS.orderingCycleDays}
          </div>
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="eyebrow mb-4">The ordering cycle</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-cream leading-tight">
                Orders go in every <span className="italic text-clay">{BUSINESS.orderingCycleDays} days.</span>
              </h2>
              <p className="text-cream/70 leading-relaxed lg:text-lg mt-6">
                We group customer requests and place orders every {BUSINESS.orderingCycleDays} days, so you always
                know when your request is moving. Once your details are confirmed and payment is done,
                your order joins the next batch — no wondering, no waiting in the dark.
              </p>
              <p className="text-cream/50 text-sm mt-4">
                You can follow every stage on the <Link to="/track-order" className="text-clay hover:underline underline-offset-4">tracking page</Link>.
              </p>
            </Reveal>
            <RevealImage
              src={images.cycle.src}
              alt={images.cycle.alt}
              aspect="16/9"
              className="shadow-2xl shadow-ink/30"
              delay={0.1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="pb-24 lg:pb-36">
      <Reveal>
        <div className="section-padding">
          <div className="relative overflow-hidden rounded-3xl min-h-[460px] flex items-center justify-center bg-ink">
            <img
              src={images.cta.src}
              alt={images.cta.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: images.cta.focal }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/30" aria-hidden="true" />
            <div className="relative text-center px-6 py-20 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-cream leading-tight text-balance">
                Found something on SHEIN you can't stop thinking about?
              </h2>
              <p className="mt-5 text-cream/80 text-lg">
                Send us the link or screenshot and we'll help you take it from saved item to order.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3.5">
                <Link to="/submit-order" className="btn-accent">
                  Send My Request
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/track-order" className="btn-ghost-light">
                  Track an Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Home() {
  return (
    <>
      <SEO
        title="SHEIN with Rejo | Order from SHEIN in Zimbabwe"
        description="Found something on SHEIN you love? Send Rejo the link or a screenshot — orders go in every 3 days with free delivery in Harare, Zimbabwe."
        path="/"
      />

      <HeroSlide hero={images.hero} />

      {/* ============ FASHION RAIL ============ */}
      <section className="py-20 lg:py-28 overflow-hidden bg-cream dark:bg-ink">
        <div className="section-padding max-w-6xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <Reveal className="max-w-xl">
              <p className="eyebrow mb-4">The fashion rail</p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink dark:text-cream leading-tight">
                A little mood board of <span className="italic text-clay">what gets ordered.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm text-charcoal/60 dark:text-cream/60 max-w-xs">
                From the daily basics to the piece you'll keep for years. Find it on SHEIN —
                Rejo handles the getting.
              </p>
            </Reveal>
          </div>
        </div>
        <ImageMarquee items={images.rail} speed={75} />
      </section>

      <MeetRejo />
      <JourneySection />
      <CycleSection />
      <FinalCta />
    </>
  )
}

export default Home
