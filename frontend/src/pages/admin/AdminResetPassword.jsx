import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import SEO from '../../components/SEO'
import { api } from '../../lib/api'

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!token) return setError('This reset link is missing its security token. Please request a new one.')
    if (newPassword !== confirmPassword) return setError('The new passwords do not match.')
    setIsSubmitting(true)
    try {
      await api.adminResetPassword(token, newPassword)
      navigate('/admin/login?reset=success', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pt-32 pb-24 lg:pt-44 min-h-[80vh] flex items-center">
      <SEO title="Choose New Admin Password | SHEIN with Rejo" description="Choose a new SHEIN with Rejo admin password." path="/admin/reset-password" />
      <div className="section-padding w-full max-w-md mx-auto">
        <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors mb-8"><HiArrowLeft className="w-4 h-4" />Back to sign in</Link>
        <div className="card p-8">
          <p className="eyebrow mb-2">Account recovery</p>
          <h1 className="font-display text-3xl text-ink dark:text-cream mb-2">Choose a new password</h1>
          <p className="text-sm text-charcoal/60 dark:text-cream/60 mb-8">Your reset link is valid for 30 minutes and can only be used once.</p>
          {error && <div role="alert" className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-sm text-red-700 dark:text-red-300">{error}</div>}
          <form onSubmit={submit} className="space-y-5">
            <div><label htmlFor="reset-new-password" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">New password</label><input id="reset-new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={12} required autoComplete="new-password" className="input-field" /><small className="block mt-1.5 text-xs text-charcoal/50 dark:text-cream/50">Use at least 12 characters, including uppercase, lowercase and a number.</small></div>
            <div><label htmlFor="reset-confirm-password" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Confirm new password</label><input id="reset-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={12} required autoComplete="new-password" className="input-field" /></div>
            <button type="submit" className="btn-accent w-full" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Set new password'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
