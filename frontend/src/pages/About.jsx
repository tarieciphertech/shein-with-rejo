import { motion } from 'framer-motion'
import { HiHeart, HiShieldCheck, HiEye } from 'react-icons/hi2'
import SEO from '../components/SEO'

const values = [
  {
    icon: HiHeart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond to ensure every order is handled with care.',
  },
  {
    icon: HiShieldCheck,
    title: 'Reliability',
    description: 'We deliver on our promises. Every order is tracked, every delivery is confirmed.',
  },
  {
    icon: HiEye,
    title: 'Transparency',
    description: 'No hidden fees, no surprises. You know exactly what you are paying for before we place any order.',
  },
]

export default function About() {
  return (
    <>
      <SEO 
        title="About Us | SHEIN with Rejo"
        description="Learn about SHEIN with Rejo - your trusted partner for easy SHEIN ordering in Zimbabwe."
        path="/about"
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
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">About Us</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal dark:text-white mt-3 mb-6">
              Simplifying SHEIN Shopping
            </h1>
            <p className="text-lg text-charcoal/70 dark:text-white/70 leading-relaxed">
              We are a dedicated service that makes ordering from SHEIN simple, reliable, 
              and accessible for customers in Zimbabwe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-charcoal">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-beige to-sand dark:from-charcoal dark:to-softblack rounded-3xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-display font-bold text-accent">R</span>
                    </div>
                    <p className="font-display text-2xl font-bold text-charcoal dark:text-white">SHEIN with Rejo</p>
                    <p className="text-charcoal/60 dark:text-white/60 mt-2">Your Shopping Partner</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal dark:text-white mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-charcoal/70 dark:text-white/70 leading-relaxed">
                  <p>
                    SHEIN with Rejo was born out of a simple observation: many people in Zimbabwe 
                    love shopping on SHEIN but find the international ordering process complicated 
                    and unreliable.
                  </p>
                  <p>
                    We set out to bridge that gap by offering a streamlined, trustworthy service 
                    that handles everything from order placement to local delivery. Our goal is 
                    to make global fashion accessible to everyone in Zimbabwe.
                  </p>
                  <p>
                    Today, we serve hundreds of happy customers across Harare and beyond, 
                    placing orders every three days and ensuring each package arrives safely 
                    at its destination.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center card p-8 sm:p-12 lg:p-16"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-charcoal/70 dark:text-white/70 leading-relaxed max-w-2xl mx-auto">
              To provide a simple, reliable, and affordable SHEIN ordering service that 
              empowers Zimbabweans to access global fashion without the complexity of 
              international shipping and payment barriers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white dark:bg-charcoal">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Our Values</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal dark:text-white mt-3">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-charcoal/60 dark:text-white/60 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
