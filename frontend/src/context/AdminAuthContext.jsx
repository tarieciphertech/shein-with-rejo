import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.adminMe()
      .then(res => { if (!cancelled) setUser(res.data?.user || null) })
      .catch(() => { if (!cancelled) setUser(null) })
      .finally(() => { if (!cancelled) setIsReady(true) })
    return () => { cancelled = true }
  }, [])

  // A successful login response only confirms the password. It does not prove
  // that the browser stored the HttpOnly session cookie. Verify it before the
  // UI is allowed to show an authenticated state or navigate to protected pages.
  const login = useCallback(async (email, password) => {
    await api.adminLogin(email, password)
    try {
      const session = await api.adminMe()
      const verifiedUser = session.data?.user
      if (!verifiedUser) throw new Error('The server did not confirm the admin session.')
      setUser(verifiedUser)
      return { data: { user: verifiedUser } }
    } catch (error) {
      setUser(null)
      if (error.status === 401) {
        const sessionError = new Error('Your sign-in was accepted, but this browser did not retain the secure session. Please allow cookies for this site and try again.')
        sessionError.status = 401
        throw sessionError
      }
      throw error
    }
  }, [])

  const refresh = useCallback(async () => {
    const res = await api.adminMe()
    setUser(res.data?.user || null)
    return res
  }, [])

  const logout = useCallback(async () => {
    try { await api.adminLogout() } finally { setUser(null) }
  }, [])

  return <AdminAuthContext.Provider value={{ user, isReady, login, refresh, logout }}>{children}</AdminAuthContext.Provider>
}
export function useAdminAuth() { const ctx = useContext(AdminAuthContext); if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider'); return ctx }
