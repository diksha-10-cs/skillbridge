import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

function ThemeToggle({ className = '' }) {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Dark / Light Theme"
    >
      <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
      <span className="theme-label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
