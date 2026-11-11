import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pending callback: called automatically after login completes
  // Used so cart can say "after login, resume checkout"
  const pendingCallbackRef = useRef(null)

  // ── Hydrate auth state on mount (reads JWT cookie via /api/auth/me) ──────────
  useEffect(() => {
    fetchMe()

    // Handle redirect back from Google OAuth (?auth=success or ?auth=error)
    const params = new URLSearchParams(window.location.search)
    if (params.has('auth')) {
      // Clean the URL without a page reload
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [])

  // ── After user state is set, fire pending callback if one is waiting ─────────
  useEffect(() => {
    if (user && pendingCallbackRef.current) {
      const cb = pendingCallbackRef.current
      pendingCallbackRef.current = null
      cb(user)
    }
  }, [user])

  async function fetchMe() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Trigger Google OAuth login.
   * @param {Function} [onSuccess] - Optional callback fired automatically after login completes.
   *   Used by the cart so checkout resumes without user clicking again.
   */
  const login = useCallback((onSuccess) => {
    if (onSuccess) {
      pendingCallbackRef.current = onSuccess
    }
    // Server-side redirect flow — no client secrets exposed
    window.location.href = '/api/auth/google'
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

