import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import './Auth.css'

function AddInternship() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Applied',
    location: 'Remote',
    stipend: '',
    notes: '',
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

    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Please provide both the company name and internship role.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.internships.create(formData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to create internship application:', err)
      setError(err.message || 'Could not save application to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-brand-badge">💼 Application Tracker</div>
          <h1>Add Internship Application</h1>
          <p className="auth-subtitle">Record details of a new company internship or placement application</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                id="company"
                type="text"
                name="company"
                placeholder="e.g. Google, Microsoft, Amazon"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Internship Role / Position *</label>
              <input
                id="role"
                type="text"
                name="role"
                placeholder="e.g. Frontend Developer Intern"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Application Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">● Applied</option>
                <option value="Interview">● Interview</option>
                <option value="Selected">● Selected</option>
                <option value="Rejected">● Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location / Work Mode</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Remote, Bangalore, Hybrid"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stipend">Stipend Package</label>
              <input
                id="stipend"
                type="text"
                name="stipend"
                placeholder="e.g. ₹40,000 / month"
                value={formData.stipend}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes, Rounds & Referral Details</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="e.g. Technical Round 1 scheduled for next Friday. Referred by college senior on LinkedIn."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Saving to Database...' : 'Save Application & Return to Dashboard →'}
            </button>
            <button
              type="button"
              className="auth-btn auth-btn-secondary"
              style={{ flex: 0.5 }}
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <Link to="/dashboard">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}

export default AddInternship