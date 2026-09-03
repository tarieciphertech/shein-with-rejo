import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import SEO from '../../components/SEO'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resetSuccess = searchParams.get('reset') === 'success'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const result = await login(email.trim(), password)
      navigate(result.data?.user?.mustChangePassword ? '/admin/account' : '/admin/orders', { replace: true })
    } catch (err) {
      setError(err.status === 401 ? 'That email and password combination is not correct. Please try again.' : err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pt-32 pb-24 lg:pt-44 min-h-[80vh] flex items-center">
      <SEO title="Admin Sign In | SHEIN with Rejo" description="Admin sign in." path="/admin/login" />
      <div className="section-padding w-full max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 dark:text-cream/60 hover:text-clay transition-colors mb-8"><HiArrowLeft className="w-4 h-4" />Back to site</Link>
        <div className="card p-8">
          <h1 className="font-display text-3xl text-ink dark:text-cream mb-2">Admin sign in</h1>
          <p className="text-sm text-charcoal/60 dark:text-cream/60 mb-8">For the SHEIN with Rejo team only.</p>
          {resetSuccess && <div role="status" className="mb-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3.5 text-sm text-emerald-700 dark:text-emerald-300">Your password has been reset. You can now sign in with your new password.</div>}
          {error && <div role="alert" className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-sm text-red-700 dark:text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label htmlFor="admin-email" className="block text-sm font-medium text-ink dark:text-cream mb-1.5">Email</label><input id="admin-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" /></div>
            <div><div className="flex items-center justify-between gap-3 mb-1.5"><label htmlFor="admin-password" className="block text-sm font-medium text-ink dark:text-cream">Password</label><Link to="/admin/forgot-password" className="text-xs font-medium text-clay-deep dark:text-clay hover:underline underline-offset-2">Forgot password?</Link></div><input id="admin-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" /></div>
            <button type="submit" className="btn-accent w-full" disabled={isSubmitting}>{isSubmitting ? <><LoadingSpinner size="sm" />Signing in…</> : 'Sign In'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
