import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 'usr-admin-01',
  name: 'Operations Manager',
  email: 'admin@silvercatering.in',
  role: 'Chief Event Administrator',
  avatar: 'SC',
}

const STORAGE_KEY = 'silver_catering_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedLocal = localStorage.getItem(STORAGE_KEY)
      if (savedLocal) return JSON.parse(savedLocal)
      const savedSession = sessionStorage.getItem(STORAGE_KEY)
      if (savedSession) return JSON.parse(savedSession)
    } catch {
      // Fallback
    }
    // Pre-seed with default logged in user in dev for seamless preview, or allow testing login
    return DEMO_USER
  })

  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email, password, rememberMe = true) => {
    setIsLoading(true)
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 350))

    const authenticatedUser = {
      ...DEMO_USER,
      email: email.trim(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || DEMO_USER.name,
    }

    setUser(authenticatedUser)

    try {
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
        sessionStorage.removeItem(STORAGE_KEY)
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.warn('Could not persist auth state:', e)
    }

    setIsLoading(false)
    return authenticatedUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Could not clear auth state:', e)
    }
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    demoCredentials: {
      email: 'admin@silvercatering.in',
      password: 'admin',
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
