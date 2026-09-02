import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  HiArrowRight,
  HiArrowLeft,
  HiPlus,
  HiTrash,
  HiPhoto,
  HiLink,
  HiCheckCircle,
  HiExclamationTriangle,
  HiPaperAirplane,
} from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import RevealImage from '../components/RevealImage'
import { api } from '../lib/api'
import { images } from '../data/images'
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '../config'

const MAX_FILE_MB = 5
const MAX_FILES_PER_ITEM = 3

const STAGES = [
  { key: 'finds', label: 'Your finds' },
  { key: 'details', label: 'Your details' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'review', label: 'Review' },
]

const emptyItem = () => ({
  url: '',
  size: '',
  color: '',
  quantity: 1,
  notes: '',
  screenshots: [],
})

const emptyCustomer = () => ({ name: '', phone: '', email: '', contactMethod: 'WhatsApp' })

function validateStage(stage, items, customer, delivery) {
  const errors = {}

  if (stage === 'finds') {
    if (!items.length) errors.items = 'Add at least one item so we know what to look for.'
    let hasContent = false
    items.forEach((item, i) => {
      const hasFile = item.screenshots.length > 0
      if (item.url.trim() || hasFile) {
        hasContent = true
        if (item.url.trim() && !/^https?:\/\//i.test(item.url.trim()) && !/^www\./i.test(item.url.trim())) {
          errors[`item-${i}-url`] = 'That link doesn\u2019t look right — it should start with https:// (or just paste it straight from the SHEIN app).'
        }
      }
    })
    if (!hasContent && !errors.items) {
      errors.items = 'Add a product link or a screenshot of the item you found.'
    }
  }

  if (stage === 'details') {
    if (!customer.name.trim()) errors.name = 'Please tell us your name so we know who the order is for.'
    if (!customer.phone.trim()) {
      errors.phone = 'We need a phone number to reach you about your request.'
    } else if (!/^[+0-9][0-9\s-]{6,}$/.test(customer.phone.trim())) {
      errors.phone = 'That phone number doesn\u2019t look complete — please double-check it.'
    }
    if (customer.email.trim() && !/^\S+@\S+\.\S+$/.test(customer.email.trim())) {
      errors.email = 'That email address doesn\u2019t look right — check it or leave it blank.'
    }
  }

  if (stage === 'delivery') {
    if (!delivery.area.trim()) {
      errors.area = 'Please tell us where in Harare we should deliver (suburb or area is fine).'
    }
  }

  return errors
}

function ItemEditor({ item, index, onChange, onRemove, canRemove, errors }) {
  const fileInputRef = useRef(null)

  const handleFiles = (fileList) => {
    const accepted = []
    const rejected = []
    Array.from(fileList).forEach((file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      const tooBig = file.size > MAX_FILE_MB * 1024 * 1024
      const tooMany = item.screenshots.length + accepted.length >= MAX_FILES_PER_ITEM
      if (!isImage) rejected.push(`${file.name} isn\u2019t a JPG, PNG or WebP image`)
      else if (tooBig) rejected.push(`${file.name} is over ${MAX_FILE_MB}MB`)
      else if (tooMany) rejected.push(`Up to ${MAX_FILES_PER_ITEM} screenshots per item`)
      else accepted.push(file)
    })
    if (accepted.length) {
      onChange({ ...item, screenshots: [...item.screenshots, ...accepted] })
    }
    if (rejected.length && fileInputRef.current) {
      // eslint-disable-next-line no-alert
      window.alert(`We couldn\u2019t add:\n\u2022 ${rejected.join('\n\u2022 ')}`)
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-ink dark:text-cream flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-clay-soft dark:bg-clay/15 text-clay-deep dark:text-clay text-sm flex items-center justify-center font-bold">{index + 1}</span>
          Item {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-charcoal/50 dark:text-cream/50 hover:text-red-600 transition-colors inline-flex items-center gap-1.5"
          >
            <HiTrash className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      {/* Product link */}
      <label htmlFor={`item-url-${index}`} className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
        Product link <span className="text-charcoal/40 dark:text-cream/40 font-normal">(if you have it)</span>
      </label>
      <div className="relative">
        <HiLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe pointer-events-none" aria-hidden="true" />
        <input
          id={`item-url-${index}`}
          type="url"
          value={item.url}
          onChange={(e) => onChange({ ...item, url: e.target.value })}
          className="input-field pl-11"
          placeholder="Paste the SHEIN link here"
        />
      </div>
      {errors[`item-${index}-url`] && <p className="text-red-600 text-sm mt-1.5">{errors[`item-${index}-url`]}</p>}

      {/* Screenshots */}
      <p className="block text-sm font-medium text-ink dark:text-cream mb-1.5 mt-5">
        Screenshot <span className="text-charcoal/40 dark:text-cream/40 font-normal">— a clear picture of the item works too</span>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        id={`item-files-${index}`}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <label
        htmlFor={`item-files-${index}`}
        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-sand dark:border-white/20 rounded-xl cursor-pointer hover:border-clay transition-colors bg-linen/60 dark:bg-white/5"
      >
        <HiPhoto className="w-6 h-6 text-taupe mb-1.5" aria-hidden="true" />
        <span className="text-sm text-charcoal/60 dark:text-cream/60">Tap to add a screenshot</span>
        <span className="text-xs text-charcoal/40 dark:text-cream/40 mt-0.5">JPG, PNG or WebP · up to {MAX_FILE_MB}MB each</span>
      </label>
      {item.screenshots.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {item.screenshots.map((file, fi) => (
            <li
              key={`${file.name}-${fi}`}
              className="relative bg-linen dark:bg-white/5 border border-sand dark:border-white/10 rounded-xl overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${fi + 1} of item ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {/* Success state */}
                <span className="absolute top-1.5 right-1.5 bg-clay text-white text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <HiCheckCircle className="w-3 h-3" aria-hidden="true" />
                  Added
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...item, screenshots: item.screenshots.filter((_, i) => i !== fi) })}
                  className="absolute top-1.5 left-1.5 w-6 h-6 bg-ink/75 text-cream rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label={`Remove screenshot ${fi + 1}`}
                >
                  <HiTrash className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
              <p className="truncate px-2.5 py-2 text-[11px] text-charcoal/60 dark:text-cream/60" title={file.name}>
                {file.name}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Size / colour / quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div>
          <label htmlFor={`item-size-${index}`} className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
            Size
          </label>
          <input
            id={`item-size-${index}`}
            type="text"
            value={item.size}
            onChange={(e) => onChange({ ...item, size: e.target.value })}
            className="input-field"
            placeholder="S, M, L, XL…"
          />
        </div>
        <div>
          <label htmlFor={`item-color-${index}`} className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
            Colour
          </label>
          <input
            id={`item-color-${index}`}
            type="text"
            value={item.color}
            onChange={(e) => onChange({ ...item, color: e.target.value })}
            className="input-field"
            placeholder="Black, white…"
          />
        </div>
        <div>
          <label htmlFor={`item-qty-${index}`} className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
            Quantity
          </label>
          <input
            id={`item-qty-${index}`}
            type="number"
            min="1"
            max="99"
            value={item.quantity}
            onChange={(e) => onChange({ ...item, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`item-notes-${index}`} className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
          Anything else about this item? <span className="text-charcoal/40 dark:text-cream/40 font-normal">(optional)</span>
        </label>
        <textarea
          id={`item-notes-${index}`}
          rows={2}
          value={item.notes}
          onChange={(e) => onChange({ ...item, notes: e.target.value })}
          className="input-field resize-none"
          placeholder="e.g. please double-check the colour in the second photo"
        />
      </div>
    </div>
  )
}

export default function SubmitOrder() {
  const reduceMotion = useReducedMotion()
  const [stageIndex, setStageIndex] = useState(0)
  const [items, setItems] = useState([emptyItem()])
  const [customer, setCustomer] = useState(emptyCustomer())
  const [delivery, setDelivery] = useState({ area: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const topRef = useRef(null)

  const stage = STAGES[stageIndex]

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [stageIndex])

  const updateItem = (index, next) => {
    setItems((prev) => prev.map((item, i) => (i === index ? next : item)))
  }

  const goTo = (nextIndex) => {
    if (nextIndex > stageIndex) {
      const stageErrors = validateStage(stage.key, items, customer, delivery)
      if (Object.keys(stageErrors).length > 0) {
        setErrors(stageErrors)
        return
      }
    }
    setErrors({})
    setSubmitError('')
    setStageIndex(Math.max(0, Math.min(STAGES.length - 1, nextIndex)))
  }

  const submit = async () => {
    // Validate everything before sending
    const allErrors = {
      ...validateStage('finds', items, customer, delivery),
      ...validateStage('details', items, customer, delivery),
      ...validateStage('delivery', items, customer, delivery),
    }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Jump to the first stage that has problems
      const problemStage = allErrors.items || Object.keys(allErrors).some((k) => k.startsWith('item-'))
        ? 0
        : allErrors.name || allErrors.phone || allErrors.email
          ? 1
          : 2
      setStageIndex(problemStage)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const response = await api.createOrder({
        items: items.map((item) => ({
          url: item.url.trim(),
          size: item.size.trim(),
          color: item.color.trim(),
          quantity: item.quantity,
          notes: item.notes.trim(),
          screenshots: item.screenshots,
        })),
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
        },
        delivery: {
          area: delivery.area.trim(),
          notes: delivery.notes.trim(),
        },
        contactMethod: customer.contactMethod,
      })
      setConfirmation(response.data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong while sending your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------- Confirmation state ---------- */
  if (confirmation) {
    return (
      <section className="pt-32 pb-24 lg:pt-44 lg:pb-36 min-h-screen">
        <div className="section-padding max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-24 h-24 mx-auto mb-8" aria-hidden="true">
              {!reduceMotion && (
                <motion.span
                  className="absolute -inset-3 rounded-full border border-clay"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <motion.span
                initial={{ scale: 0, rotate: -16 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 230, damping: 13, delay: 0.12, duration: 0.7 }}
                className="absolute inset-0 rounded-full bg-clay-soft dark:bg-clay/15 flex items-center justify-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.3, duration: 0.6 }}
                >
                  <HiCheckCircle className="w-12 h-12 text-clay-deep dark:text-clay" />
                </motion.span>
              </motion.span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl sm:text-5xl text-ink dark:text-cream text-center"
            >
              You're on the list ✨
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-4 text-charcoal/70 dark:text-cream/70 text-center text-lg"
            >
              Your SHEIN request has been received.
            </motion.p>

            <div className="mt-10 bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6 sm:p-8">
              <dl className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-charcoal/60 dark:text-cream/60">Your reference</dt>
                  <dd className="font-mono text-lg font-semibold text-clay-deep dark:text-clay select-all">{confirmation.reference}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-charcoal/60 dark:text-cream/60">Submitted</dt>
                  <dd className="text-sm text-ink dark:text-cream">
                    {new Date(confirmation.submittedAt || Date.now()).toLocaleString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-charcoal/60 dark:text-cream/60">Status</dt>
                  <dd className="text-sm font-medium text-ink dark:text-cream">Request received</dd>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t border-sand dark:border-white/10">
                <h2 className="text-sm font-semibold text-ink dark:text-cream mb-2">What happens next</h2>
                <ol className="space-y-2 text-sm text-charcoal/70 dark:text-cream/70 list-decimal list-inside">
                  <li>Rejo reviews your request and confirms the details with you.</li>
                  <li>Once payment is settled, your order joins the next ordering cycle — orders go in every {BUSINESS.orderingCycleDays} days.</li>
                  <li>Track your request any time using your reference and phone number.</li>
                </ol>
              </div>
            </div>

            <p className="mt-6 text-sm text-charcoal/60 dark:text-cream/60 text-center">
              Save or screenshot your reference — you'll need it to track your order.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3.5">
              <Link to="/track-order" className="btn-accent">
                Track My Request
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href={whatsappLink(`Hi Rejo, I've just submitted a SHEIN request. My reference is ${confirmation.reference}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink"
              >
                <FaWhatsapp className="w-5 h-5 mr-2 text-[#25D366]" />
                Message Rejo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ---------- Form stages ---------- */
  return (
    <section className="pt-32 pb-24 lg:pt-44 lg:pb-36 min-h-screen">
      <div ref={topRef} className="h-0" aria-hidden="true" />
      <div className="section-padding max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <SEO
          title="Send a Request | SHEIN with Rejo"
          description="Send us your SHEIN find — a product link or a screenshot, with your size, colour and quantity. Orders go in every 3 days with free delivery in Harare."
          path="/submit-order"
        />

        {/* Visual sidebar — imagery reinforces "found it, send it" without touching the form */}
        <aside className="lg:col-span-5" aria-label="The story behind sending a request">
          <div className="lg:sticky lg:top-28">
            {/* Mobile: compact visual intro before the form */}
            <div className="lg:hidden relative overflow-hidden rounded-2xl aspect-[21/9]">
              <img
                src={images.order.side.src}
                alt={images.order.side.alt}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: images.order.side.focal }}
              />
            </div>

            {/* Desktop: editorial composition + note */}
            <div className="hidden lg:block">
              <RevealImage
                src={images.order.side.src}
                alt={images.order.side.alt}
                aspect="3/4"
                focal={images.order.side.focal}
              />
              <motion.blockquote
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6"
              >
                <p className="font-display italic text-xl text-ink dark:text-cream leading-relaxed">
                  “Found something you love? Send it to Rejo — that's where it starts.”
                </p>
                <footer className="mt-3 text-sm text-charcoal/50 dark:text-cream/50">
                  A link or one screenshot is enough to begin.
                </footer>
              </motion.blockquote>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7">
        <p className="eyebrow mb-4">Send a request</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink dark:text-cream">What did you find? 👀</h1>
        <p className="mt-4 text-charcoal/70 dark:text-cream/70 text-lg">
          Send us a SHEIN link or a screenshot. You don't need to have everything figured
          out before you start.
        </p>

        {/* Progress */}
        <ol className="mt-10 flex items-center gap-2" aria-label="Form progress">
          {STAGES.map((s, i) => (
            <li key={s.key} className="flex-1">
              <button
                type="button"
                onClick={() => i < stageIndex && goTo(i)}
                disabled={i > stageIndex}
                className="w-full text-left disabled:cursor-default"
                aria-current={i === stageIndex ? 'step' : undefined}
              >
                <span
                  className={`block h-1 rounded-full transition-colors duration-300 ${
                    i < stageIndex ? 'bg-clay' : i === stageIndex ? 'bg-ink dark:bg-cream' : 'bg-sand dark:bg-white/15'
                  }`}
                />
                <span
                  className={`mt-2 block text-xs font-medium ${
                    i <= stageIndex ? 'text-ink dark:text-cream' : 'text-charcoal/40 dark:text-cream/40'
                  }`}
                >
                  {i + 1}. {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {submitError && (
          <div role="alert" className="mt-8 flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4">
            <HiExclamationTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-8"
          >
            {stage.key === 'finds' && (
              <div className="space-y-5">
                {items.map((item, index) => (
                  <ItemEditor
                    key={index}
                    item={item}
                    index={index}
                    onChange={(next) => updateItem(index, next)}
                    onRemove={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                    canRemove={items.length > 1}
                    errors={errors}
                  />
                ))}
                {errors.items && <p role="alert" className="text-red-600 text-sm">{errors.items}</p>}
                <button
                  type="button"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                  className="w-full border-2 border-dashed border-sand dark:border-white/20 rounded-2xl py-4 text-sm font-medium text-clay-deep dark:text-clay hover:border-clay transition-colors inline-flex items-center justify-center gap-2"
                >
                  <HiPlus className="w-5 h-5" aria-hidden="true" />
                  Add another item
                </button>
              </div>
            )}

            {stage.key === 'details' && (
              <div className="bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Your name *</label>
                  <input
                    id="customer-name"
                    type="text"
                    autoComplete="name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Tendai M"
                  />
                  {errors.name && <p role="alert" className="text-red-600 text-sm mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Phone / WhatsApp number *</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="input-field"
                    placeholder="07xx xxx xxx"
                  />
                  {errors.phone && <p role="alert" className="text-red-600 text-sm mt-1.5">{errors.phone}</p>}
                  <p className="text-xs text-charcoal/40 dark:text-cream/40 mt-1.5">
                    We use this to confirm your details and arrange delivery.
                  </p>
                </div>
                <div>
                  <label htmlFor="customer-email" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Email <span className="text-charcoal/40 dark:text-cream/40 font-normal">(optional)</span></label>
                  <input
                    id="customer-email"
                    type="email"
                    autoComplete="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p role="alert" className="text-red-600 text-sm mt-1.5">{errors.email}</p>}
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-ink dark:text-cream mb-2">How should we reach you?</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {['WhatsApp', 'Phone call', 'Email'].map((method) => (
                      <label
                        key={method}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer text-sm transition-colors ${
                          customer.contactMethod === method
                            ? 'border-clay bg-clay-soft dark:bg-clay/15 text-clay-deep dark:text-clay font-medium'
                            : 'border-sand dark:border-white/15 text-charcoal/70 dark:text-cream/70 hover:border-clay'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={customer.contactMethod === method}
                          onChange={(e) => setCustomer({ ...customer, contactMethod: e.target.value })}
                          className="sr-only"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {stage.key === 'delivery' && (
              <div className="bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="bg-clay-soft dark:bg-clay/15 rounded-xl p-4 text-sm text-clay-deep dark:text-clay">
                  🚚 Delivery is currently <strong>free within Harare</strong>. Outside Harare?
                  <a
                    href={whatsappLink(WHATSAPP_MESSAGES.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 ml-1"
                  >
                    Message us
                  </a>
                  and we'll talk about your options.
                </div>
                <div>
                  <label htmlFor="delivery-area" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
                    Delivery area in Harare *
                  </label>
                  <input
                    id="delivery-area"
                    type="text"
                    value={delivery.area}
                    onChange={(e) => setDelivery({ ...delivery, area: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Borrowdale, Mt Pleasant, CBD…"
                  />
                  {errors.area && <p role="alert" className="text-red-600 text-sm mt-1.5">{errors.area}</p>}
                </div>
                <div>
                  <label htmlFor="delivery-notes" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
                    Delivery notes <span className="text-charcoal/40 dark:text-cream/40 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="delivery-notes"
                    rows={3}
                    value={delivery.notes}
                    onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Landmarks, best times to deliver, anything helpful"
                  />
                </div>
              </div>
            )}

            {stage.key === 'review' && (
              <div className="space-y-5">
                <div className="bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6 sm:p-8">
                  <h2 className="font-semibold text-ink dark:text-cream mb-4">Your finds</h2>
                  <ul className="space-y-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start border-b border-sand dark:border-white/10 pb-4 last:border-0 last:pb-0">
                        {item.screenshots.length > 0 ? (
                          <img
                            src={URL.createObjectURL(item.screenshots[0])}
                            alt={`Item ${i + 1} screenshot`}
                            className="w-14 h-14 object-cover rounded-lg border border-sand dark:border-white/10 shrink-0"
                          />
                        ) : (
                          <span className="w-14 h-14 rounded-lg bg-linen dark:bg-white/5 flex items-center justify-center shrink-0">
                            <HiLink className="w-5 h-5 text-taupe" aria-hidden="true" />
                          </span>
                        )}
                        <div className="min-w-0 text-sm">
                          <p className="font-medium text-ink dark:text-cream truncate">
                            {item.url.trim() ? item.url.trim() : `Screenshot upload${item.screenshots.length > 1 ? ` (${item.screenshots.length})` : ''}`}
                          </p>
                          <p className="text-charcoal/60 dark:text-cream/60 mt-0.5">
                            {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(' · ') || 'No size or colour given yet'}
                          </p>
                          {item.notes && <p className="text-charcoal/50 dark:text-cream/50 mt-0.5 italic">{item.notes}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-charcoal border border-sand dark:border-white/10 rounded-2xl p-6 sm:p-8 grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-ink dark:text-cream mb-1.5">Contact</h3>
                    <p className="text-charcoal/70 dark:text-cream/70">{customer.name}</p>
                    <p className="text-charcoal/70 dark:text-cream/70">{customer.phone}</p>
                    {customer.email && <p className="text-charcoal/70 dark:text-cream/70 break-all">{customer.email}</p>}
                    <p className="text-charcoal/50 dark:text-cream/50 mt-1">Preferred: {customer.contactMethod}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-cream mb-1.5">Delivery</h3>
                    <p className="text-charcoal/70 dark:text-cream/70">{delivery.area}</p>
                    {delivery.notes && <p className="text-charcoal/50 dark:text-cream/50 italic">{delivery.notes}</p>}
                    <p className="text-charcoal/50 dark:text-cream/50 mt-1">Free delivery in Harare</p>
                  </div>
                </div>

                <p className="text-sm text-charcoal/60 dark:text-cream/60">
                  No payment is needed right now. Rejo will review your request, confirm the
total with you, and only then will payment be arranged.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {stageIndex > 0 ? (
            <button type="button" onClick={() => goTo(stageIndex - 1)} className="btn-secondary" disabled={isSubmitting}>
              <HiArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          ) : (
            <span />
          )}

          {stageIndex < STAGES.length - 1 ? (
            <button type="button" onClick={() => goTo(stageIndex + 1)} className="btn-primary">
              Continue
              <HiArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button type="button" onClick={submit} className="btn-accent" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Sending…
                </>
              ) : (
                <>
                  Send My Request
                  <HiPaperAirplane className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
        </div>
      </div>
    </section>
  )
}
