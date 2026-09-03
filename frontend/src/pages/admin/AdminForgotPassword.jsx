import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import SEO from '../../components/SEO'
import { api } from '../../lib/api'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)
    try {
      const result = await api.adminRequestPasswordReset(email.trim())
      setMessage(result.message || 'If that email is the admin account, a password reset link has been sent.')
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pt-32 pb-24 lg:pt-44 min-h-[80vh] flex items-center">
      <SEO title="Reset Admin Password | SHEIN with Rejo" description="Recover access to the SHEIN with Rejo admin account." path="/admin/forgot-password" />
      <div className="section-padding w-full max-w-md mx-auto">
        <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors mb-8"><HiArrowLeft className="w-4 h-4" />Back to sign in</Link>
        <div className="card p-8">
          <p className="eyebrow mb-2">Account recovery</p>
          <h1 className="font-display text-3xl text-ink dark:text-cream mb-2">Reset your password</h1>
          <p className="text-sm text-charcoal/60 dark:text-cream/60 mb-8">Enter the admin email address and we’ll send a secure reset link.</p>
          {error && <div role="alert" className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-sm text-red-700 dark:text-red-300">{error}</div>}
          {message && <div role="status" className="mb-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3.5 text-sm text-emerald-700 dark:text-emerald-300">{message}</div>}
          <form onSubmit={submit} className="space-y-5">
            <div><label htmlFor="reset-email" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Admin email</label><input id="reset-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" /></div>
            <button type="submit" className="btn-accent w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send reset link'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
