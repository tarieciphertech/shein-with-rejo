import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown, HiQuestionMarkCircle } from 'react-icons/hi2'
import SEO from '../components/SEO'
import { faqs } from '../data/sampleData'

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-sand dark:border-white/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base sm:text-lg font-medium text-charcoal dark:text-white pr-4 group-hover:text-accent transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <HiChevronDown className="w-5 h-5 text-charcoal/50 dark:text-white/50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-charcoal/70 dark:text-white/70 leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <>
      <SEO 
        title="FAQ | SHEIN with Rejo"
        description="Find answers to frequently asked questions about ordering from SHEIN with Rejo."
        path="/faq"
      />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Support</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal dark:text-white mt-3 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-charcoal/70 dark:text-white/70 max-w-xl mx-auto">
                Got questions? We have got answers. If you cannot find what you are looking for, 
                feel free to contact us.
              </p>
            </div>

            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sand dark:border-white/10">
                <HiQuestionMarkCircle className="w-6 h-6 text-accent" />
                <h2 className="text-lg font-semibold text-charcoal dark:text-white">
                  Common Questions
                </h2>
              </div>

              <div>
                {faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
