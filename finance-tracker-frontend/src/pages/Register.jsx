// src/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  // ---- inline design tokens ----
  const palette = {
    bg: '#f5f6f8',
    card: '#ffffff',
    text: '#0f172a',
    muted: '#6b7280',
    brand: '#cc6a00',
    brandHover: '#b65d00',
    ring: '#e5e7eb',
    danger: '#dc3545',
    success: '#16a34a'
  }
  const shadow = '0 12px 28px rgba(16,24,40,.08), 0 2px 4px rgba(16,24,40,.06)'

  // ---- inline styles ----
  const styles = {
    wrapper: {
      minHeight: 'calc(100vh - 56px)',
      display: 'grid',
      placeItems: 'center',
      padding: '32px 16px',
      background: palette.bg
    },
    card: { 
      width: '100%',
      maxWidth: 450,
      background: palette.card,
      borderRadius: 16,
      boxShadow: shadow,
      padding: '40px 36px',
      border: '1px solid #eef2f7',
      color: palette.text
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 800,
      color: palette.brand,
      textAlign: 'center',
      marginBottom: 20
    },
    field: { marginBottom: 16 },
    label: { fontWeight: 600, marginBottom: 6, display: 'block' },
    input: {
      width: '100%',
      borderRadius: 12,
      padding: '12px 14px',
      border: `1px solid ${palette.ring}`,
      outline: 'none',
      transition: 'box-shadow .2s, border-color .2s',
      fontSize: 16,
      background: '#fff'
    },
    inputFocus: {
      borderColor: palette.brand,
      boxShadow: '0 0 0 4px rgba(204,106,0,.15)'
    },
    button: {
      width: '100%',
      borderRadius: 12,
      padding: '12px 16px',
      fontWeight: 700,
      fontSize: 16,
      color: '#fff',
      background: palette.brand,
      border: `1px solid ${palette.brand}`,
      cursor: 'pointer'
    },
    buttonHover: {
      background: palette.brandHover,
      borderColor: palette.brandHover
    },
    footer: { textAlign: 'center', marginTop: 16, color: palette.muted },
    link: { color: palette.brand, fontWeight: 600, textDecoration: 'none' },
    linkHover: { color: palette.brandHover, textDecoration: 'underline' },
    alertError: {
      background: '#fff',
      border: `1px solid ${palette.danger}`,
      color: palette.danger,
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 12
    },
    alertSuccess: {
      background: '#fff',
      border: `1px solid ${palette.success}`,
      color: palette.success,
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 12
    }
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [focus, setFocus] = useState({ name: false, email: false, password: false })
  const [hover, setHover] = useState(false)
  const [linkHover, setLinkHover] = useState(false)

  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Registration failed')
      setSuccess(data?.message || 'Registration successful.')
      setTimeout(() => nav('/login'), 900)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>

        {error && <div style={styles.alertError}>{error}</div>}
        {success && <div style={styles.alertSuccess}>{success}</div>}

        <form onSubmit={onSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              style={{ ...styles.input, ...(focus.name ? styles.inputFocus : {}) }}
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocus(s => ({ ...s, name: true }))}
              onBlur={() => setFocus(s => ({ ...s, name: false }))}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={{ ...styles.input, ...(focus.email ? styles.inputFocus : {}) }}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus(s => ({ ...s, email: true }))}
              onBlur={() => setFocus(s => ({ ...s, email: false }))}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={{ ...styles.input, ...(focus.password ? styles.inputFocus : {}) }}
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocus(s => ({ ...s, password: true }))}
              onBlur={() => setFocus(s => ({ ...s, password: false }))}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}), opacity: loading ? 0.85 : 1 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ ...styles.link, ...(linkHover ? styles.linkHover : {}) }}
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
