import { Link } from 'react-router-dom'
import {
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiArrowRight,
  HiChatBubbleLeftRight,
} from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '../config'

const channels = [
  {
    icon: FaWhatsapp,
    title: 'WhatsApp — fastest reply',
    value: BUSINESS.phoneDisplay,
    href: whatsappLink(WHATSAPP_MESSAGES.general),
    external: true,
    note: 'Best for quick questions, order updates and sending screenshots.',
    highlight: true,
  },
  {
    icon: HiPhone,
    title: 'Phone',
    value: BUSINESS.phoneDisplay,
    href: `tel:${BUSINESS.phoneIntl}`,
    external: true,
    note: 'Prefer to talk it through? Give Rejo a call.',
  },
  {
    icon: HiEnvelope,
    title: 'Email',
    value: BUSINESS.email,
    href: `mailto:${BUSINESS.email}`,
    external: true,
    note: 'Good for longer questions or detailed requests.',
  },
  {
    icon: HiMapPin,
    title: 'Where we operate',
    value: BUSINESS.location,
    note: 'Delivery is currently free within Harare. Outside Harare? Message us to talk about your options.',
  },
]

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact | SHEIN with Rejo"
        description="Reach SHEIN with Rejo on WhatsApp or by phone at 0784 487 866, or email remudzamba@gmail.com. Serving customers in Harare, Zimbabwe."
        path="/contact"
      />

      <PageHeader
        eyebrow="Contact"
        title={<>Talk to <span className="italic text-clay">Rejo directly.</span></>}
      >
        <p>
          No ticket numbers, no call centre. Messages go straight to the person who will
          handle your order.
        </p>
      </PageHeader>

      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {channels.map((channel, index) => {
              const Icon = channel.icon
              const inner = (
                <>
                  <div className="flex items-start justify-between">
                    <span
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        channel.highlight
                          ? 'bg-[#25D366] text-white'
                          : 'bg-clay-soft dark:bg-clay/15 text-clay-deep dark:text-clay'
                      }`}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    {channel.external && (
                      <HiArrowRight className="w-5 h-5 text-taupe group-hover:text-clay transition-colors" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-ink dark:text-cream">{channel.title}</h2>
                  {channel.href ? (
                    <p className="mt-1 text-clay-deep dark:text-clay font-medium break-all">{channel.value}</p>
                  ) : (
                    <p className="mt-1 text-ink dark:text-cream font-medium">{channel.value}</p>
                  )}
                  <p className="mt-2 text-sm text-charcoal/60 dark:text-cream/60 leading-relaxed">{channel.note}</p>
                </>
              )
              const classes = `card p-6 sm:p-7 block group hover:shadow-lg hover:shadow-ink/5 ${
                channel.href ? 'cursor-pointer' : ''
              }`
              return channel.href ? (
                <Reveal key={channel.title} delay={index * 0.05}>
                  <a
                    href={channel.href}
                    target={channel.external && channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.external && channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={classes}
                  >
                    {inner}
                  </a>
                </Reveal>
              ) : (
                <Reveal key={channel.title} delay={index * 0.05}>
                  <div className={classes}>{inner}</div>
                </Reveal>
              )
            })}
          </div>

          {/* Ready to order */}
          <Reveal delay={0.1} className="mt-14">
            <div className="card-dark p-8 sm:p-12 text-center">
              <HiChatBubbleLeftRight className="w-10 h-10 text-clay mx-auto mb-4" aria-hidden="true" />
              <h2 className="font-display text-2xl sm:text-3xl text-cream mb-3">Ready to send your first request?</h2>
              <p className="text-cream/70 max-w-xl mx-auto">
                You don't need everything figured out — a link or a screenshot is enough to start.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3.5">
                <Link to="/submit-order" className="btn-accent">
                  Send a SHEIN Request
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/faq" className="btn-ghost-light">
                  Read the FAQ first
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
