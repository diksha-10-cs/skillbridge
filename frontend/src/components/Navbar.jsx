import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">🎓</div>
          Skill<span>Bridge</span>
        </Link>

        <div className="nav-actions-group">
          {/* Theme toggle directly visible in navbar */}
          <ThemeToggle />

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role !== 'admin' && (
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Admin Panel
                </Link>
              )}
              {user?.role !== 'admin' && (
                <Link
                  to="/add-internship"
                  className={`nav-link ${location.pathname === '/add-internship' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  + Add Internship
                </Link>
              )}
              <Link
                to="/profile"
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Profile
              </Link>
              <span className="user-badge">
                👤 {user?.fullName?.split(' ')[0] || 'Student'}
              </span>
              <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link" onClick={closeMenu}>
                Features
              </a>
              <a href="/#how-it-works" className="nav-link" onClick={closeMenu}>
                How It Works
              </a>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="nav-btn nav-btn-primary"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar