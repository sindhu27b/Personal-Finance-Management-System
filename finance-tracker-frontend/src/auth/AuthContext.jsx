import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [email, setEmail] = useState(localStorage.getItem('email') || '')

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token')
    if (email) localStorage.setItem('email', email); else localStorage.removeItem('email')
  }, [token, email])

  const login = (tk, em) => { setToken(tk); setEmail(em) }
  const logout = () => { setToken(''); setEmail('') }

  return <AuthContext.Provider value={{ token, email, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
