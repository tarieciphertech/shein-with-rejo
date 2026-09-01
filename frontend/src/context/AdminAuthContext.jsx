import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .adminMe()
      .then((res) => {
        if (!cancelled) setUser(res.data || null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.adminLogin(email, password)
    setUser(res.data?.user || null)
    return res
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.adminLogout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AdminAuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
