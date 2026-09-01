import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiMagnifyingGlass,
  HiExclamationTriangle,
  HiMagnifyingGlassPlus,
  HiCheckCircle,
} from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/SEO'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import { api } from '../lib/api'
import { orderTimeline } from '../data/content'
import { whatsappLink, BUSINESS } from '../config'

const STATUS_ALIASES = {
  pending: 'pending',
  received: 'pending',
  reviewed: 'reviewed',
  in_review: 'reviewed',
  priced: 'priced',
  quoted: 'priced',
  paid: 'paid',
  payment_confirmed: 'paid',
  ordered: 'ordered',
  placed: 'ordered',
  shipped: 'shipped',
  in_transit: 'shipped',
  transit: 'shipped',
  delivered: 'delivered',
  ready: 'delivered',
  ready_for_pickup: 'delivered',
  cancelled: 'cancelled',
}

function normalizeStatus(status) {
  if (!status) return 'pending'
  return STATUS_ALIASES[String(status).toLowerCase()] || 'pending'
}

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function Timeline({ status }) {
  const normalized = normalizeStatus(status)
  const currentIndex = orderTimeline.findIndex((s) => s.key === normalized)
  const cancelled = normalized === 'cancelled'

  return (
    <ol className="relative mt-8">
      {orderTimeline.map((step, index) => {
        const done = !cancelled && index <= currentIndex
        const isCurrent = !cancelled && index === currentIndex
        return (
          <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector */}
            {index < orderTimeline.length - 1 && (
              <span
                className={`absolute left-[15px] top-8 bottom-0 w-px ${
                  !cancelled && index < currentIndex ? 'bg-clay' : 'bg-sand dark:bg-white/15'
                }`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                done
                  ? 'bg-clay text-white'
                  : 'bg-white dark:bg-charcoal border-2 border-sand dark:border-white/20 text-taupe'
              } ${isCurrent ? 'ring-4 ring-clay/20' : ''}`}
              aria-hidden="true"
            >
              {done ? <HiCheckCircle className="w-5 h-5" /> : <span className="w-2 h-2 rounded-full bg-current" />}
            </span>
            <div>
              <p className={`font-medium ${done ? 'text-ink dark:text-cream' : 'text-charcoal/40 dark:text-cream/40'}`}>
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-clay-deep dark:text-clay">
                    Current step
                  </span>
                )}
              </p>
              <p className={`text-sm mt-0.5 ${done ? 'text-charcoal/60 dark:text-cream/60' : 'text-charcoal/35 dark:text-cream/35'}`}>
                {step.description}
              </p>
            </div>
          </li>
        )
      })}
      {cancelled && (
        <li className="mt-2 text-sm text-red-600 dark:text-red-400">
          This request was cancelled. If that doesn't sound right, message Rejo on WhatsApp.
        </li>
      )}
    </ol>
  )
}

export default function OrderTracking() {
  const [reference, setReference] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | notfound | error | found
  const [errorMessage, setErrorMessage] = useState('')
  const [searchedRef, setSearchedRef] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!reference.trim() || !phone.trim()) {
      setStatus('error')
      setErrorMessage('Please enter both your order reference and the phone number you used.')
      return
    }
    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await api.trackOrder(reference, phone)
      setOrder(response.data)
      setSearchedRef(reference.trim())
      setStatus('found')
    } catch (error) {
      if (error.status === 404) {
        setStatus('notfound')
      } else {
        setStatus('error')
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <>
      <SEO
        title="Track Your Order | SHEIN with Rejo"
        description="Track your SHEIN request with Rejo. Enter your order reference and phone number to see the current status."
        path="/track-order"
      />

      <PageHeader
        eyebrow="Order tracking"
        title={<>Where's my <span className="italic text-clay">order?</span></>}
      >
        <p>
          Enter your request reference and the phone number you provided, and we'll show
          you exactly where things stand.
        </p>
      </PageHeader>

      <section className="pb-24 lg:pb-36">
        <div className="section-padding max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="card p-6 sm:p-8" noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="track-ref" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
                  Order reference
                </label>
                <input
                  id="track-ref"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="input-field font-mono uppercase"
                  placeholder="e.g. SWR-7F3K9Q"
                  autoComplete="off"
                />
                <p className="text-xs text-charcoal/40 dark:text-cream/40 mt-1.5">
                  You received this when you submitted your request.
                </p>
              </div>
              <div>
                <label htmlFor="track-phone" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
                  Phone number
                </label>
                <input
                  id="track-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="The number you gave us"
                  autoComplete="tel"
                />
              </div>
            </div>

            <button type="submit" className="btn-accent w-full mt-6" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <LoadingSpinner size="sm" />
                  Checking…
                </>
              ) : (
                <>
                  <HiMagnifyingGlass className="w-5 h-5 mr-2" />
                  Track My Order
                </>
              )}
            </button>
          </form>

          {/* Not found — empty state */}
          {status === 'notfound' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="mt-6 card p-8 text-center"
            >
              <span className="w-14 h-14 rounded-full bg-linen dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                <HiMagnifyingGlassPlus className="w-7 h-7 text-taupe" aria-hidden="true" />
              </span>
              <h2 className="font-semibold text-ink dark:text-cream mb-2">We couldn't find that request</h2>
              <p className="text-sm text-charcoal/60 dark:text-cream/60 max-w-sm mx-auto">
                Check your reference and phone number and try again. Still stuck? Message Rejo
                on WhatsApp and she'll look into it for you.
              </p>
              <a
                href={whatsappLink(`Hi Rejo, I'm trying to track my order (reference: ${searchedRef}) but it's not showing up.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-6 dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink"
              >
                <FaWhatsapp className="w-5 h-5 mr-2 text-[#25D366]" />
                Ask Rejo on WhatsApp
              </a>
            </motion.div>
          )}

          {/* Error state */}
          {status === 'error' && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4"
            >
              <HiExclamationTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </motion.div>
          )}

          {/* Found — timeline */}
          {status === 'found' && order && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-6"
            >
              <div className="card p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-sand dark:border-white/10">
                  <div>
                    <p className="text-xs uppercase tracking-widest2 text-clay font-semibold">Reference</p>
                    <p className="font-mono text-lg font-semibold text-ink dark:text-cream mt-0.5">{searchedRef}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest2 text-clay font-semibold">Submitted</p>
                    <p className="text-sm text-charcoal/70 dark:text-cream/70 mt-0.5">{formatDate(order.submittedAt || order.createdAt)}</p>
                  </div>
                </div>

                <Timeline status={order.status} />

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-sand dark:border-white/10">
                    <h3 className="text-sm font-semibold text-ink dark:text-cream mb-3">
                      {order.items.length === 1 ? '1 item on this request' : `${order.items.length} items on this request`}
                    </h3>
                    <ul className="space-y-2">
                      {order.items.map((item, i) => (
                        <li key={i} className="text-sm text-charcoal/70 dark:text-cream/70 flex gap-3">
                          <span className="text-clay font-semibold shrink-0">{i + 1}.</span>
                          <span className="min-w-0">
                            {item.url ? (
                              <span className="block truncate">{item.url}</span>
                            ) : (
                              <span>Screenshot upload</span>
                            )}
                            <span className="block text-charcoal/50 dark:text-cream/50">
                              {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(' · ') || 'Details pending review'}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <p className="mt-5 text-sm text-charcoal/60 dark:text-cream/60 text-center">
                Questions about this order? WhatsApp Rejo on{' '}
                <a
                  href={whatsappLink(`Hi Rejo, I have a question about my order ${searchedRef}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-deep dark:text-clay font-medium hover:underline underline-offset-2"
                >
                  {BUSINESS.phoneDisplay}
                </a>
                , or{' '}
                <Link to="/contact" className="text-clay-deep dark:text-clay font-medium hover:underline underline-offset-2">
                  use the contact page
                </Link>
                .
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
