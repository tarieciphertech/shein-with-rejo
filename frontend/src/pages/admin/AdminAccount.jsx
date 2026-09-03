import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiOutlineLogout } from 'react-icons/hi2'
import SEO from '../../components/SEO'
import { api } from '../../lib/api'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminAccount() {
  const { user, refresh, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (newPassword !== confirmPassword) return setError('The new passwords do not match.')
    setSaving(true)
    try {
      await api.adminChangePassword(currentPassword, newPassword)
      await refresh()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password changed successfully.')
      if (user?.mustChangePassword) navigate('/admin/orders', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="pt-28 pb-20 lg:pt-36 min-h-[80vh]">
      <SEO title="Account & Security | SHEIN with Rejo" description="Manage your SHEIN with Rejo admin account security." path="/admin/account" />
      <div className="section-padding max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl text-ink dark:text-cream">Account & Security</h1>
            <p className="text-sm text-charcoal/60 dark:text-cream/60 mt-1">{user?.email}</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors">
            <HiOutlineLogout className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <h2 className="font-display text-2xl text-ink dark:text-cream">Change password</h2>
              <p className="text-sm text-charcoal/60 dark:text-cream/60 mt-1">Update your admin password whenever you need to.</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-linen dark:bg-white/10 text-charcoal/60 dark:text-cream/60">Security</span>
          </div>

          {user?.mustChangePassword && <div className="mb-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-3.5 text-sm text-amber-800 dark:text-amber-200">For security, choose a new password before continuing.</div>}
          {error && <div role="alert" className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-sm text-red-700 dark:text-red-300">{error}</div>}
          {message && <div role="status" className="mb-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3.5 text-sm text-emerald-700 dark:text-emerald-300">{message}</div>}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Current password</label>
              <input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required autoComplete="current-password" className="input-field" />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">New password</label>
              <input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={12} required autoComplete="new-password" className="input-field" />
              <small className="block mt-1.5 text-xs text-charcoal/50 dark:text-cream/50">Use at least 12 characters, including uppercase, lowercase and a number.</small>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Confirm new password</label>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={12} required autoComplete="new-password" className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="btn-accent w-full sm:w-auto">
              {saving ? 'Saving…' : 'Change password'}
            </button>
          </form>
        </div>

        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 mt-6 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors">
          <HiArrowLeft className="w-4 h-4" />
          Back to orders
        </Link>
      </div>
    </section>
  )
}
