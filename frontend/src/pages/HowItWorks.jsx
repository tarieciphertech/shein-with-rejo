import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import RevealImage from '../components/RevealImage'
import { images } from '../data/images'
import { BUSINESS } from '../config'

const STAGES = [
  {
    key: 'find',
    number: '01',
    title: 'Find it',
    description: 'Open the SHEIN app or website and find something you love. You do not need a SHEIN account or to check out — just look.',
    chip: 'No account needed',
    image: images.howItWorks.find,
    aspect: '4/5',
  },
  {
    key: 'send',
    number: '02',
    title: 'Send it',
    description: 'Copy the product link, or take a screenshot. Either one works. Send it to Rejo through the request form.',
    chip: 'Link or screenshot',
    image: images.howItWorks.send,
    aspect: '4/5',
  },
  {
    key: 'check',
    number: '03',
    title: 'We check it',
    description: 'Rejo reviews the request and confirms the details with you — size, colour, availability — before anything is ordered.',
    chip: 'Confirmed with you',
    image: images.howItWorks.review,
    aspect: '4/5',
  },
  {
    key: 'order',
    number: '04',
    title: 'We place it',
    description: 'Payment is settled — EcoCash, cash or PayPal — and your confirmed request joins the next ordering cycle, every 3 days.',
    chip: `Every ${BUSINESS.orderingCycleDays} days`, keyword: 'ordered',
    image: images.howItWorks.order,
    aspect: '4/5',
  },
  {
    key: 'receive',
    number: '05',
    title: 'You receive it',
    description: 'Follow it on the tracking page as it travels, then receive it at your door — free delivery in Harare.',
    chip: 'Free in Harare',
    image: images.howItWorks.receive,
    aspect: '4/5',
  },
]

const FINISHING_STEPS = [
  { number: '06', title: 'Payment & confirmation', description: 'You receive the total, choose your method, and Rejo confirms everything before any order is placed.' },
  { number: '07', title: 'Track your order', description: 'Use your request reference and phone number on the tracking page to see exactly where things stand.' },
  { number: '08', title: 'Receive your items', description: 'We deliver to your address in Harare — free of charge.' },
]

export default function HowItWorks() {
  return (
    <>
      <SEO
        title="How It Works | SHEIN with Rejo"
        description="From finding your item on SHEIN to delivery in Harare — the steps of ordering with Rejo, told visually."
        path="/how-it-works"
      />

      <PageHeader
        eyebrow="How it works"
        title={<>From saved item to <span className="italic text-clay">your doorstep.</span></>}
      >
        <p>
          Eight steps, one person helping you through all of them. Here's exactly what happens
          when you order from SHEIN with Rejo
        </p>
        <p className="mt-3 text-sm text-charcoal/50 dark:text-cream/50">
          Scroll through the story — each stage is one moment of your order's journey.
        </p>
      </PageHeader>

      {/* Visual story stages */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto space-y-20 lg:space-y-28">
          {STAGES.map((stage, index) => {
            const flip = index % 2 === 1
            return (
              <div key={stage.key} className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                <Reveal className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
                  <RevealImage
                    src={stage.image.src}
                    alt={stage.image.alt}
                    aspect={stage.aspect}
                    focal={stage.image.focal}
                    className="w-full"
                  />
                </Reveal>
                <div className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
                  <Reveal>
                    <span className="font-display italic text-6xl lg:text-7xl text-clay/30 dark:text-clay/40 leading-none" aria-hidden="true">
                      {stage.number}
                    </span>
                    <h2 className="mt-4 text-2xl lg:text-4xl font-medium text-ink dark:text-cream">
                      {stage.title}
                    </h2>
                    <p className="mt-4 text-charcoal/70 dark:text-cream/70 leading-relaxed lg:text-lg max-w-lg">
                      {stage.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 bg-clay-soft dark:bg-clay/15 text-clay-deep dark:text-clay text-sm font-semibold px-4 py-2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-clay" aria-hidden="true" />
                      {stage.chip}
                    </span>
                  </Reveal>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Finishing steps — quiet text row (image-first story above is the visual rest) */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-x-12 border-t border-sand dark:border-white/10">
            {FINISHING_STEPS.map((step, index) => (
              <Reveal as="div" key={step.number} delay={index * 0.06} className="py-8 lg:py-10 border-b border-sand dark:border-white/10 md:border-b-0">
                <span className="font-display italic text-3xl text-clay/40 dark:text-clay/60" aria-hidden="true">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink dark:text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70 leading-relaxed">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3-day cycle explainer */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <Reveal>
            <div className="card-dark p-8 sm:p-14 lg:p-20 relative overflow-hidden">
              <div
                className="absolute -right-8 -bottom-14 font-display italic font-medium text-[14rem] lg:text-[20rem] leading-none text-white/[0.04] select-none pointer-events-none"
                aria-hidden="true"
              >
                {BUSINESS.orderingCycleDays}
              </div>
              <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-xl">
                  <p className="eyebrow mb-4">The ordering cycle</p>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-cream leading-tight">
                    Orders go in every <span className="italic text-clay">{BUSINESS.orderingCycleDays} days.</span>
                  </h2>
                  <p className="mt-5 text-cream/70 leading-relaxed">
                    We group customer requests and place orders every {BUSINESS.orderingCycleDays} days. Once your request is
                    confirmed, it joins the next cycle — so you always know when it's moving into the
                    ordering process. No guessing, and no pretending we can place your order the same
                    minute you send it. Just a clear, predictable rhythm.
                  </p>
                  <p className="mt-4 text-cream/50 text-sm">
                    We won't show you a fake countdown. Your status updates on the tracking page are the truth.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3.5">
                    <Link to="/submit-order" className="btn-accent">
                      Send My Request
                      <HiArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link to="/track-order" className="btn-ghost-light">
                      Track an Order
                    </Link>
                  </div>
                </div>
                <RevealImage
                  src={images.cycle.src}
                  alt={images.cycle.alt}
                  aspect="16/9"
                  className="shadow-2xl shadow-ink/30"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Honest expectations */}
      <section className="pb-24 lg:pb-36">
        <div className="section-padding max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-linen dark:bg-white/5 rounded-2xl p-8 sm:p-10">
              <h2 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream mb-4">What we promise — and what we don't</h2>
              <div className="grid sm:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                  <h3 className="font-semibold text-ink dark:text-cream mb-2">You can count on</h3>
                  <ul className="space-y-2 text-charcoal/70 dark:text-cream/70 list-disc list-inside">
                    <li>Orders placed every {BUSINESS.orderingCycleDays} days</li>
                    <li>Free delivery within Harare</li>
                    <li>Personal updates from Rejo at each step</li>
                    <li>Clear confirmation before payment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-ink dark:text-cream mb-2">We won't pretend</h3>
                  <ul className="space-y-2 text-charcoal/70 dark:text-cream/70 list-disc list-inside">
                    <li>We can't control SHEIN's own stock or international shipping times</li>
                    <li>We're not SHEIN — an independent ordering service</li>
                    <li>We currently deliver in Harare only; message us about other areas</li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
