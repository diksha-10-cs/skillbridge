import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    college: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.course.trim() ||
      !formData.college.trim()
    ) {
      setError('Please fill in all the required fields.')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        course: formData.course.trim(),
        college: formData.college.trim(),
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Account registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-brand-badge">🎓 Free Student Registration</div>
          <h1>Create Your Account</h1>
          <p className="auth-subtitle">Join SkillBridge to organize your internship applications and placements</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name *</label>
              <input
                id="signup-name"
                type="text"
                name="fullName"
                placeholder="e.g. Alex Johnson"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address *</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="e.g. alex@college.edu"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-password">Password (min. 6 chars) *</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm Password *</label>
              <input
                id="signup-confirm"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-course">Degree / Course *</label>
              <input
                id="signup-course"
                type="text"
                name="course"
                placeholder="e.g. B.Tech Computer Science / BCA"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-college">College / University *</label>
              <input
                id="signup-college"
                type="text"
                name="college"
                placeholder="e.g. Institute of Engineering"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Your Account...' : 'Create Account & Open Dashboard →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup