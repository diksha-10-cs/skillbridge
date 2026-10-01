import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillbridge_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('skillbridge_token') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('skillbridge_token')
      if (storedToken) {
        try {
          const res = await api.auth.getProfile()
          if (res.success && res.user) {
            setUser(res.user)
            localStorage.setItem('skillbridge_user', JSON.stringify(res.user))
          }
        } catch (error) {
          console.warn('Session verification failed, logging out:', error.message)
          logout()
        }
      }
      setLoading(false)
    }

    verifyAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password })
    if (res.success && res.token) {
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('skillbridge_token', res.token)
      localStorage.setItem('skillbridge_user', JSON.stringify(res.user))
      return res.user
    }
  }

  const register = async (userData) => {
    const res = await api.auth.register(userData)
    if (res.success && res.token) {
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('skillbridge_token', res.token)
      localStorage.setItem('skillbridge_user', JSON.stringify(res.user))
      return res.user
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('skillbridge_token')
    localStorage.removeItem('skillbridge_user')
  }

  const updateProfile = async (profileData) => {
    const res = await api.auth.updateProfile(profileData)
    if (res.success && res.user) {
      setUser(res.user)
      localStorage.setItem('skillbridge_user', JSON.stringify(res.user))
      return res.user
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
