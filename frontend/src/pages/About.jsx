import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { BUSINESS, whatsappLink, AFFILIATION_DISCLAIMER } from '../config'

export default function About() {
  return (
    <>
      <SEO
        title="About | SHEIN with Rejo"
        description="SHEIN with Rejo is an independent, Harare-based ordering service helping Zimbabwean customers get the items they find on SHEIN — without the payment and shipping headaches."
        path="/about"
      />

      <PageHeader eyebrow="About" title={<>A real person, helping real shoppers <span className="italic text-clay">in Harare.</span></>}>
        <p>
          SHEIN with Rejo is a personal ordering service. Not a shop with its own stock, and not
          SHEIN — an independent helper between you and the things you've found on SHEIN.
        </p>
      </PageHeader>

      {/* Story */}
      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12">
            <Reveal direction="right" className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="aspect-[4/5] rounded-2xl bg-linen dark:bg-white/5 border border-sand dark:border-white/10 flex flex-col items-center justify-center gap-4 p-8">
                  <span className="w-24 h-24 rounded-full bg-ink dark:bg-cream text-cream dark:text-ink flex items-center justify-center font-display text-5xl font-medium" aria-hidden="true">R</span>
                  <p className="font-display italic text-xl text-charcoal/70 dark:text-cream/70 text-center">Photo coming soon</p>
                  <p className="text-xs text-charcoal/40 dark:text-cream/40 text-center max-w-[200px]">
                    An authentic photo of Rejo will replace this placeholder.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7 space-y-10">
              <Reveal>
                <h2 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream mb-4">Why it exists</h2>
                <div className="space-y-4 text-charcoal/70 dark:text-cream/70 leading-relaxed">
                  <p>
                    If you've ever saved something on SHEIN and then hit the wall — cards that don't work
                    here, shipping that doesn't reach Zimbabwe, checkout pages that fail at the last step —
                    you know the frustration. The item is right there. You just can't get it.
                  </p>
                  <p>
                    SHEIN with Rejo was started to close that gap. You find the item; Rejo handles the
                    ordering, the payment process and the delivery, and keeps you updated until it reaches
                    your door in Harare.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <h2 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream mb-4">How it works, in short</h2>
                <div className="space-y-4 text-charcoal/70 dark:text-cream/70 leading-relaxed">
                  <p>
                    You send a product link or a screenshot, with your size, colour and quantity. Rejo reviews
                    the request and confirms the details with you. Once payment is settled, your order joins
                    the next ordering cycle — orders go in every {BUSINESS.orderingCycleDays} days. Then you track
                    it and receive it, with free delivery in Harare.
                  </p>
                  <p>
                    You don't need a SHEIN account, an international payment card, or any special app.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <h2 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream mb-4">Who is behind it</h2>
                <div className="space-y-4 text-charcoal/70 dark:text-cream/70 leading-relaxed">
                  <p>
                    Rejo — the R in the logo — runs the service day to day: reviewing requests, answering
                    WhatsApps, placing the orders and arranging delivery. When you message the business,
                    you're talking to a person, not a bot.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className="bg-linen dark:bg-white/5 rounded-2xl p-6 sm:p-8">
                  <h3 className="font-semibold text-ink dark:text-cream mb-2">Being clear about who we are</h3>
                  <p className="text-sm text-charcoal/70 dark:text-cream/70 leading-relaxed">
                    {AFFILIATION_DISCLAIMER} We never claim to be an official SHEIN store, and we don't sell
                    our own inventory — we help you order the items <em>you</em> have chosen.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className="flex flex-wrap gap-3.5">
                  <Link to="/submit-order" className="btn-accent">
                    Send a Request
                  </Link>
                  <a
                    href={whatsappLink('Hi Rejo, I have a question about placing a SHEIN order.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink"
                  >
                    WhatsApp Rejo
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
