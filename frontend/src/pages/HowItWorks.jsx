import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  HiMagnifyingGlass,
  HiLink,
  HiClipboardDocumentList,
  HiCurrencyDollar,
  HiShoppingCart,
  HiGift,
  HiArrowRight,
  HiCalendarDays
} from 'react-icons/hi2'
import SEO from '../components/SEO'
import { steps } from '../data/sampleData'

const iconMap = {
  '01': HiMagnifyingGlass,
  '02': HiLink,
  '03': HiClipboardDocumentList,
  '04': HiCurrencyDollar,
  '05': HiShoppingCart,
  '06': HiGift,
}

export default function HowItWorks() {
  return (
    <>
      <SEO 
        title="How It Works | SHEIN with Rejo"
        description="Learn how to order from SHEIN through Rejo in 6 simple steps."
        path="/how-it-works"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Process</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal dark:text-white mt-3 mb-6">
              How It Works
            </h1>
            <p className="text-lg text-charcoal/70 dark:text-white/70 leading-relaxed">
              Ordering from SHEIN through Rejo is simple. Follow these six easy steps 
              and we will handle the rest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-white dark:bg-charcoal">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-sand dark:bg-white/10" />

              <div className="space-y-12 lg:space-y-16">
                {steps.map((step, index) => {
                  const Icon = iconMap[step.number]
                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex gap-6 sm:gap-8"
                    >
                      {/* Step Number / Icon */}
                      <div className="relative z-10 shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-charcoal dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-charcoal" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="card p-6 sm:p-8 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">
                            Step {step.number}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-charcoal/60 dark:text-white/60 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="card-dark p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HiCalendarDays className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  We Place SHEIN Orders Every 3 Days
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-8">
                  To ensure efficiency and keep costs low, we consolidate all orders and 
                  place them with SHEIN every three days. This means your order will be 
                  placed in the next available batch.
                </p>
                <Link to="/submit-order" className="btn-primary bg-white text-charcoal hover:bg-gray-100">
                  Get Started Now
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
