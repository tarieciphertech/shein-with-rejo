import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HiPhone, 
  HiEnvelope, 
  HiMapPin,
  HiClock,
  HiPaperAirplane
} from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSent(true)
  }

  return (
    <>
      <SEO 
        title="Contact Us | SHEIN with Rejo"
        description="Get in touch with SHEIN with Rejo. Call, email, or message us on WhatsApp."
        path="/contact"
      />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal dark:text-white mt-3 mb-4">
                Contact Us
              </h1>
              <p className="text-charcoal/70 dark:text-white/70">
                Have questions or need help? We are here for you. Reach out through any of the channels below.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/263784487866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow group"
                >
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FaWhatsapp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal dark:text-white">Chat on WhatsApp</h3>
                    <p className="text-sm text-charcoal/60 dark:text-white/60">Fastest response time</p>
                  </div>
                </a>

                {/* Contact Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <HiPhone className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-medium text-charcoal dark:text-white mb-1">Phone</h3>
                    <a href="tel:+263784487866" className="text-sm text-charcoal/70 dark:text-white/70 hover:text-accent transition-colors">
                      0784 487 866
                    </a>
                  </div>

                  <div className="card p-5">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <HiEnvelope className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-medium text-charcoal dark:text-white mb-1">Email</h3>
                    <a href="mailto:remudzamba@gmail.com" className="text-sm text-charcoal/70 dark:text-white/70 hover:text-accent transition-colors break-all">
                      remudzamba@gmail.com
                    </a>
                  </div>

                  <div className="card p-5">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <HiMapPin className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-medium text-charcoal dark:text-white mb-1">Location</h3>
                    <p className="text-sm text-charcoal/70 dark:text-white/70">
                      Harare, Zimbabwe
                    </p>
                  </div>

                  <div className="card p-5">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <HiClock className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-medium text-charcoal dark:text-white mb-1">Hours</h3>
                    <p className="text-sm text-charcoal/70 dark:text-white/70">
                      Mon-Sat: 8AM - 6PM
                    </p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-beige dark:bg-white/5 flex items-center justify-center">
                    <div className="text-center p-8">
                      <HiMapPin className="w-10 h-10 text-accent mx-auto mb-3" />
                      <p className="text-sm text-charcoal/60 dark:text-white/60">
                        Google Maps integration coming soon
                      </p>
                      <p className="text-xs text-charcoal/40 dark:text-white/40 mt-1">
                        Harare, Zimbabwe
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="card p-6 sm:p-8">
                  {isSent ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiPaperAirplane className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-charcoal/60 dark:text-white/60 text-sm">
                        We will get back to you as soon as possible.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">
                        Send Us a Message
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                            Name *
                          </label>
                          <input
                            required
                            className="input-field dark:input-field-dark"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            className="input-field dark:input-field-dark"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Subject
                        </label>
                        <input
                          className="input-field dark:input-field-dark"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Message *
                        </label>
                        <textarea
                          required
                          rows={5}
                          className="input-field dark:input-field-dark resize-none"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gradient w-full disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner size="sm" />
                            Sending...
                          </span>
                        ) : (
                          <>
                            Send Message
                            <HiPaperAirplane className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
