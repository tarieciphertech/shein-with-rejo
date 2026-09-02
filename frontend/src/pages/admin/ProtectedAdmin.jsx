import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function ProtectedAdmin({ children, allowPasswordChange = false }) {
  const { user, isReady } = useAdminAuth()

  if (!isReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-sm text-charcoal/50 dark:text-cream/50">Checking your session…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/admin/account" replace />
  }

  return children
}
