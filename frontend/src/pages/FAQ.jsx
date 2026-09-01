import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown, HiArrowRight } from 'react-icons/hi2'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { faqs } from '../data/content'
import { whatsappLink, WHATSAPP_MESSAGES } from '../config'

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-b border-sand dark:border-white/10 last:border-0">
      <h3>
        <button
          id={buttonId}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        >
          <span className="text-base sm:text-lg font-medium text-ink dark:text-cream group-hover:text-clay transition-colors">
            {faq.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-clay"
          >
            <HiChevronDown className="w-5 h-5" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-charcoal/70 dark:text-cream/70 leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ | SHEIN with Rejo"
        description="Answers to common questions about ordering from SHEIN with Rejo — payments, the 3-day ordering cycle, delivery in Harare, tracking and more."
        path="/faq"
      />

      <PageHeader
        eyebrow="FAQ"
        title={<>Questions, <span className="italic text-clay">answered honestly.</span></>}
      >
        <p>
          Everything customers usually ask before sending their first request. If your question
          isn't here, just message Rejo on WhatsApp.
        </p>
      </PageHeader>

      <section className="pb-20 lg:pb-28">
        <div className="section-padding max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-white dark:bg-charcoal rounded-2xl border border-sand dark:border-white/10 px-6 sm:px-10 py-4">
              {faqs.map((faq, index) => (
                <FAQItem key={faq.question} faq={faq} index={index} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-10 text-center">
            <p className="text-charcoal/70 dark:text-cream/70 mb-4">Still not sure about something?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3.5">
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink"
              >
                Ask on WhatsApp
              </a>
              <Link to="/submit-order" className="btn-accent">
                Send a Request
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
