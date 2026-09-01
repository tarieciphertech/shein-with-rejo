import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiArrowLeft, HiPhoto, HiExclamationTriangle } from 'react-icons/hi2'
import SEO from '../../components/SEO'
import LoadingSpinner from '../../components/LoadingSpinner'
import { api } from '../../lib/api'
import { API_URL } from '../../config'

const STATUSES = ['pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'awaiting_confirmation', 'confirmed']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedNote, setSavedNote] = useState('')
  const [form, setForm] = useState({ status: '', paymentStatus: '', adminNotes: '' })

  const load = useCallback(() => {
    setIsLoading(true)
    setError('')
    api
      .adminOrder(id)
      .then((res) => {
        const data = res.data
        setOrder(data)
        setForm({
          status: data.status || 'pending',
          paymentStatus: data.paymentStatus || 'pending',
          adminNotes: data.adminNotes || '',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const save = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError('')
    setSavedNote('')
    try {
      const res = await api.adminUpdateOrder(id, {
        status: form.status,
        paymentStatus: form.paymentStatus,
        adminNotes: form.adminNotes,
      })
      setOrder((prev) => ({ ...prev, ...res.data }))
      setSavedNote('Changes saved.')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="pt-40 pb-20 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-40 pb-20 section-padding max-w-xl mx-auto text-center">
        <HiExclamationTriangle className="w-10 h-10 text-taupe mx-auto mb-4" aria-hidden="true" />
        <h1 className="font-display text-2xl text-ink dark:text-cream mb-2">We couldn't load this order</h1>
        <p className="text-sm text-charcoal/60 dark:text-cream/60 mb-6">{error || 'Order not found.'}</p>
        <Link to="/admin/orders" className="btn-secondary">Back to orders</Link>
      </div>
    )
  }

  return (
    <section className="pt-28 pb-20 lg:pt-36">
      <SEO title={`Admin — ${order.reference} | SHEIN with Rejo`} description="Admin order detail." path="/admin/orders" />
      <div className="section-padding max-w-5xl mx-auto">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors mb-6">
          <HiArrowLeft className="w-4 h-4" />
          All orders
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="eyebrow mb-1">Order</p>
            <h1 className="font-mono text-2xl sm:text-3xl font-semibold text-ink dark:text-cream">{order.reference}</h1>
            <p className="text-sm text-charcoal/60 dark:text-cream/60 mt-1">
              Submitted {order.submittedAt ? new Date(order.submittedAt).toLocaleString('en-GB') : '—'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink dark:text-cream mb-4">Customer</h2>
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-charcoal/50 dark:text-cream/50">Name</dt>
                  <dd className="text-ink dark:text-cream font-medium">{order.customer?.name || '—'}</dd>
                </div>
                <div>
                  <dt className="text-charcoal/50 dark:text-cream/50">Phone</dt>
                  <dd className="text-ink dark:text-cream font-medium">{order.customer?.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-charcoal/50 dark:text-cream/50">Email</dt>
                  <dd className="text-ink dark:text-cream break-all">{order.customer?.email || '—'}</dd>
                </div>
                <div>
                  <dt className="text-charcoal/50 dark:text-cream/50">Preferred contact</dt>
                  <dd className="text-ink dark:text-cream">{order.contactMethod || '—'}</dd>
                </div>
              </dl>
            </div>

            {/* Delivery */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink dark:text-cream mb-4">Delivery</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-charcoal/50 dark:text-cream/50">Area</dt>
                  <dd className="text-ink dark:text-cream">{order.delivery?.area || '—'}</dd>
                </div>
                {order.delivery?.notes && (
                  <div>
                    <dt className="text-charcoal/50 dark:text-cream/50">Notes</dt>
                    <dd className="text-ink dark:text-cream">{order.delivery.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Items */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink dark:text-cream mb-4">
                Items ({order.items?.length || 0})
              </h2>
              <ul className="space-y-5">
                {(order.items || []).map((item, i) => (
                  <li key={i} className="border border-sand dark:border-white/10 rounded-xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <p className="text-sm font-medium text-ink dark:text-cream break-all">
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-clay-deep dark:text-clay hover:underline underline-offset-2">
                            {item.url}
                          </a>
                        ) : (
                          'No link provided'
                        )}
                      </p>
                      <p className="text-xs text-charcoal/50 dark:text-cream/50">
                        {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(' · ') || 'No details'}
                      </p>
                    </div>
                    {item.notes && <p className="text-sm text-charcoal/60 dark:text-cream/60 italic mb-3">{item.notes}</p>}
                    {Array.isArray(item.screenshots) && item.screenshots.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {item.screenshots.map((shot, si) => (
                          <a
                            key={si}
                            href={`${API_URL}/api/uploads/${shot.filename || shot}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-20 h-20 rounded-lg border border-sand dark:border-white/10 overflow-hidden flex items-center justify-center bg-linen dark:bg-white/5 hover:border-clay transition-colors"
                            title="Open screenshot"
                          >
                            <HiPhoto className="w-6 h-6 text-taupe" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status history */}
            {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-ink dark:text-cream mb-4">Status history</h2>
                <ol className="space-y-3 text-sm">
                  {order.statusHistory.map((entry, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink dark:text-cream">{entry.newStatus || entry.toStatus}</span>
                      <span className="text-charcoal/40 dark:text-cream/40">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleString('en-GB') : ''}
                        {entry.changedBy ? ` · by ${entry.changedBy}` : ''}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right: controls */}
          <div className="lg:col-span-1">
            <form onSubmit={save} className="card p-6 lg:sticky lg:top-28 space-y-5">
              <h2 className="font-semibold text-ink dark:text-cream">Update order</h2>

              {savedNote && (
                <p role="status" className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3">
                  {savedNote}
                </p>
              )}
              {saveError && (
                <p role="alert" className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  {saveError}
                </p>
              )}

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Payment status</label>
                <select
                  id="paymentStatus"
                  value={form.paymentStatus}
                  onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                  className="input-field"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <p className="text-xs text-charcoal/40 dark:text-cream/40 mt-1.5">
                  Payment methods: EcoCash, cash, or PayPal — confirm with the customer.
                </p>
              </div>

              <div>
                <label htmlFor="adminNotes" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Internal notes</label>
                <textarea
                  id="adminNotes"
                  rows={5}
                  value={form.adminNotes}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Only visible to admins"
                />
              </div>

              <button type="submit" className="btn-accent w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
