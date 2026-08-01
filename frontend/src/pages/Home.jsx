import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiLink, 
  HiShieldCheck, 
  HiCalendarDays, 
  HiTruck, 
  HiChatBubbleLeftRight,
  HiArrowRight,
  HiUsers,
  HiShoppingBag,
  HiMapPin
} from 'react-icons/hi2'
import SEO from '../components/SEO'
import { stats, features } from '../data/sampleData'

const iconMap = {
  link: HiLink,
  shield: HiShieldCheck,
  calendar: HiCalendarDays,
  truck: HiTruck,
  headphones: HiChatBubbleLeftRight,
  users: HiUsers,
  package: HiShoppingBag,
  map: HiMapPin,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Home() {
  return (
    <>
      <SEO path="/" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-warm/20 rounded-full blur-3xl" />
        </div>

        <div className="section-padding relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-6">
                Trusted by 500+ Customers in Zimbabwe
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal dark:text-white leading-tight mb-6"
            >
              Shop SHEIN Easily{' '}
              <span className="text-accent">with Rejo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-charcoal/70 dark:text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Simply send us product links or screenshots from the SHEIN app, 
              and we will handle the ordering for you. Orders placed every 3 days 
              with free delivery in Harare.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/submit-order" className="btn-gradient text-base w-full sm:w-auto">
                Start Your Order
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/contact" className="btn-secondary text-base w-full sm:w-auto">
                Contact Us
              </Link>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon]
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-4 sm:p-6 bg-white dark:bg-charcoal rounded-2xl shadow-sm border border-sand/50 dark:border-white/10"
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal dark:text-white">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-charcoal/60 dark:text-white/60 mt-1">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-charcoal">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal dark:text-white mt-3 mb-4">
              Everything You Need
            </h2>
            <p className="text-charcoal/70 dark:text-white/70">
              We have simplified the entire SHEIN ordering process so you can shop without hassle.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature) => {
              const Icon = iconMap[feature.icon]
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="card p-6 lg:p-8 group"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal/60 dark:text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center card-dark p-8 sm:p-12 lg:p-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Browse SHEIN, send us your links or screenshots, and let us handle the rest. 
              It is that simple.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/submit-order" className="btn-primary bg-white text-charcoal hover:bg-gray-100 w-full sm:w-auto">
                Submit Your Order
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center text-white hover:text-accent transition-colors">
                Learn How It Works
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
