import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiMagnifyingGlass, HiArrowRight } from 'react-icons/hi2'
import { HiOutlineLogout } from 'react-icons/hi'
import SEO from '../../components/SEO'
import LoadingSpinner from '../../components/LoadingSpinner'
import { api } from '../../lib/api'
import { useAdminAuth } from '../../context/AdminAuthContext'

const STATUSES = ['pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'awaiting_confirmation', 'confirmed']

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-blue-100 text-blue-800',
  priced: 'bg-purple-100 text-purple-800',
  paid: 'bg-emerald-100 text-emerald-800',
  ordered: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const { user, logout } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError('')
    api
      .adminOrders({ search, status, paymentStatus, page })
      .then((res) => {
        if (cancelled) return
        setOrders(res.data?.orders || [])
        setPagination(res.data?.pagination || null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [search, status, paymentStatus, page])

  return (
    <section className="pt-28 pb-20 lg:pt-36">
      <SEO title="Admin — Orders | SHEIN with Rejo" description="Admin order management." path="/admin/orders" />
      <div className="section-padding max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl text-ink dark:text-cream">Orders</h1>
            {user && <p className="text-sm text-charcoal/60 dark:text-cream/60 mt-1">Signed in as {user.email}</p>}
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 sm:p-5 mb-6 grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              className="input-field pl-11"
              placeholder="Search reference, name, phone…"
              aria-label="Search orders"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value)
            }}
            className="input-field"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPage(1)
              setPaymentStatus(e.target.value)
            }}
            className="input-field"
            aria-label="Filter by payment status"
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 && !error ? (
          <div className="card p-12 text-center">
            <h2 className="font-semibold text-ink dark:text-cream mb-2">No orders here yet</h2>
            <p className="text-sm text-charcoal/60 dark:text-cream/60">
              {search || status || paymentStatus
                ? 'Nothing matches these filters. Try clearing the search or filters.'
                : 'When customers submit SHEIN requests, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-charcoal/50 dark:text-cream/50 border-b border-sand dark:border-white/10">
                    <th className="px-5 py-3.5 font-medium">Reference</th>
                    <th className="px-5 py-3.5 font-medium">Customer</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Payment</th>
                    <th className="px-5 py-3.5 font-medium">Submitted</th>
                    <th className="px-5 py-3.5" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-sand/70 dark:border-white/5 last:border-0 hover:bg-linen/60 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-clay-deep dark:text-clay">{order.reference}</td>
                      <td className="px-5 py-4">
                        <p className="text-ink dark:text-cream font-medium">{order.customer?.name || '—'}</p>
                        <p className="text-charcoal/50 dark:text-cream/50">{order.customer?.phone || ''}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 capitalize text-charcoal/70 dark:text-cream/70">
                        {(order.paymentStatus || 'pending').replace('_', ' ')}
                      </td>
                      <td className="px-5 py-4 text-charcoal/60 dark:text-cream/60">
                        {order.submittedAt ? new Date(order.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-clay-deep dark:text-clay hover:underline underline-offset-2"
                        >
                          View
                          <HiArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-charcoal/60 dark:text-cream/60">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
