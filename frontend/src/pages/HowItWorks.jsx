import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { BUSINESS } from '../config'
import { howItWorksSteps } from '../data/content'

export default function HowItWorks() {
  return (
    <>
      <SEO
        title="How It Works | SHEIN with Rejo"
        description="From finding your item on SHEIN to delivery in Harare — the eight steps of ordering with Rejo, explained simply."
        path="/how-it-works"
      />

      <PageHeader
        eyebrow="How it works"
        title={<>From saved item to <span className="italic text-clay">your doorstep.</span></>}
      >
        <p>
          Eight steps, one person helping you through all of them. Here's exactly what happens
          when you order from SHEIN with Rejo.
        </p>
      </PageHeader>

      {/* Steps — editorial alternating layout */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <ol className="grid md:grid-cols-2 gap-x-14">
            {howItWorksSteps.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                delay={(index % 2) * 0.08}
                className={`border-t border-sand dark:border-white/10 py-8 lg:py-10 flex gap-5 sm:gap-7 ${
                  index >= howItWorksSteps.length - 2 ? 'md:border-b md:border-sand md:dark:border-white/10' : ''
                }`}
              >
                <span
                  className={`font-display italic text-4xl lg:text-5xl leading-none shrink-0 ${
                    index % 2 === 0 ? 'text-clay/40 dark:text-clay/60' : 'text-clay dark:text-clay'
                  }`}
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold text-ink dark:text-cream">{step.title}</h2>
                  <p className="mt-2 text-charcoal/70 dark:text-cream/70 leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 3-day cycle explainer */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <Reveal>
            <div className="card-dark p-8 sm:p-14 lg:p-20 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-14 font-display italic font-medium text-[14rem] lg:text-[20rem] leading-none text-white/[0.04] select-none pointer-events-none" aria-hidden="true">
                {BUSINESS.orderingCycleDays}
              </div>
              <div className="relative max-w-2xl">
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
