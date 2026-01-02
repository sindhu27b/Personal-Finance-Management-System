import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function NavBar() {
  const { token, logout } = useAuth()
  const nav = useNavigate()
  const onLogout = () => { logout(); nav('/login') }

  const palette = {
    brand: '#cc6a00',
    link: '#334155',
    brandTint: 'rgba(204,106,0,.10)',
    brandHover: 'rgba(204,106,0,.06)',
    danger: '#ef4444',
    dangerHover: '#dc2626'
  }

  const styles = {
    bar: { background:'#fff', boxShadow:'0 10px 24px rgba(15,23,42,.06)', borderBottom:'1px solid #eaeef3' },
    brand: { color: palette.brand, fontWeight: 800, letterSpacing: '.3px' },
    linkBase: { padding:'8px 14px', borderRadius:12, fontWeight:600, color: palette.link },
    logout: { background: palette.danger, border:`1px solid ${palette.danger}`, color:'#fff', padding:'8px 14px', borderRadius:12, fontWeight:700, cursor:'pointer' },
  }

  const FancyLink = ({ to, children }) => {
    const [hov, setHov] = React.useState(false)
    return (
      <NavLink
        to={to}
        className="nav-link"
        style={({ isActive }) => ({
          ...styles.linkBase,
          background: isActive ? palette.brandTint : (hov ? palette.brandHover : 'transparent'),
          color: isActive ? palette.brand : styles.linkBase.color
        })}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </NavLink>
    )
  }

  return (
    <nav className="navbar navbar-expand-lg mb-3" style={styles.bar}>
      <div className="container">
        {/* Left: brand */}
        <Link className="navbar-brand" to="/dashboard" style={styles.brand}>
          Finance Tracker
        </Link>

        {token && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav"
              aria-controls="nav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="nav">
              {/* Right: links + logout (whole cluster pushed right) */}
              <div className="ms-auto d-flex align-items-center gap-2">
                <ul className="navbar-nav d-flex align-items-center" style={{ gap: 8, margin:0 }}>
                    <li className="nav-item"><FancyLink to="/dashboard">Dashboard</FancyLink></li>
                  <li className="nav-item"><FancyLink to="/income">Income</FancyLink></li>
                  <li className="nav-item"><FancyLink to="/expenses">Expenses</FancyLink></li>
                  <li className="nav-item"><FancyLink to="/investments">Investments</FancyLink></li>
                  <li className="nav-item"><FancyLink to="/reports">Reports</FancyLink></li>
                </ul>

                <button
                  className="btn btn-sm"
                  onClick={onLogout}
                  onMouseEnter={e => (e.currentTarget.style.background = palette.dangerHover, e.currentTarget.style.borderColor = palette.dangerHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = palette.danger, e.currentTarget.style.borderColor = palette.danger)}
                  style={styles.logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
