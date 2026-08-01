import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMagnifyingGlass, HiClock } from 'react-icons/hi2'
import SEO from '../components/SEO'

export default function OrderTracking() {
  const [orderRef, setOrderRef] = useState('')
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <>
      <SEO 
        title="Track Order | SHEIN with Rejo"
        description="Track your SHEIN order status with Rejo. Enter your order reference and phone number."
        path="/track-order"
      />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Tracking</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal dark:text-white mt-3 mb-4">
                Track Your Order
              </h1>
              <p className="text-charcoal/70 dark:text-white/70">
                Enter your order reference and phone number to check your order status.
              </p>
            </div>

            <div className="card p-6 sm:p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    className="input-field dark:input-field-dark"
                    placeholder="e.g., ORD-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field dark:input-field-dark"
                    placeholder="0784 487 866"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gradient w-full"
                >
                  <HiMagnifyingGlass className="w-5 h-5 mr-2" />
                  Track Order
                </button>
              </form>

              {searched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-beige/50 dark:bg-white/5 rounded-xl text-center"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiClock className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">
                    Tracking Integration Coming Soon
                  </h3>
                  <p className="text-sm text-charcoal/60 dark:text-white/60">
                    We are working on a real-time tracking system. For now, please contact us 
                    via WhatsApp or phone for updates on your order status.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
