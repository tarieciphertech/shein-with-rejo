import { useState } from 'react'
import { api } from '../../lib/api'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminAccount() {
  const { user, logout } = useAdminAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError(''); setMessage('')
    if (newPassword !== confirmPassword) return setError('The new passwords do not match.')
    setSaving(true)
    try {
      await api.adminChangePassword(currentPassword, newPassword)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setMessage('Password changed successfully. Your temporary password can no longer be used.')
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return <main className="admin-page">
    <div className="admin-shell">
      <header className="admin-header"><div><p className="eyebrow">Account / Security</p><h1>Account security</h1><p>{user?.email}</p></div><button type="button" onClick={logout}>Sign out</button></header>
      <section className="admin-card">
        <h2>Change password</h2>
        {user?.mustChangePassword && <div className="admin-alert">For security, you must choose a new password before continuing.</div>}
        {error && <div className="admin-error">{error}</div>}
        {message && <div className="admin-success">{message}</div>}
        <form onSubmit={submit}>
          <label>Current password<input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required autoComplete="current-password" /></label>
          <label>New password<input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={12} required autoComplete="new-password" /><small>Use at least 12 characters, including uppercase, lowercase and a number.</small></label>
          <label>Confirm new password<input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={12} required autoComplete="new-password" /></label>
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Set new password'}</button>
        </form>
      </section>
    </div>
  </main>
}
