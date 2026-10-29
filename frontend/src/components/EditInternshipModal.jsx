import { useState, useEffect } from 'react'
import './EditInternshipModal.css'

function EditInternshipModal({ isOpen, internship, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    status: 'Applied',
    location: '',
    stipend: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (internship) {
      setFormData({
        company: internship.company || '',
        role: internship.role || '',
        date: internship.date || new Date().toISOString().split('T')[0],
        status: internship.status || 'Applied',
        location: internship.location || '',
        stipend: internship.stipend || '',
        notes: internship.notes || '',
      })
      setError('')
    }
  }, [internship])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !internship) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Please provide both the company name and internship role.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onSave(internship._id, formData)
      onClose()
    } catch (err) {
      console.error('Failed to update internship details:', err)
      setError(err.message || 'Could not update internship. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-badge">✏️ Edit Mode</div>
            <h2>Edit Internship Details</h2>
            <p>Update role, timeline, compensation, or round notes for {internship.company}.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <div className="modal-body">
          {error && <div className="modal-error">⚠️ {error}</div>}

          <form id="edit-internship-form" className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-row">
              <div className="modal-group">
                <label htmlFor="edit-company">Company Name *</label>
                <input
                  id="edit-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google, Microsoft"
                  required
                />
              </div>

              <div className="modal-group">
                <label htmlFor="edit-role">Internship Role *</label>
                <input
                  id="edit-role"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Engineering Intern"
                  required
                />
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-group">
                <label htmlFor="edit-date">Application Date</label>
                <input
                  id="edit-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-group">
                <label htmlFor="edit-status">Application Status</label>
                <select
                  id="edit-status"
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

            <div className="modal-row">
              <div className="modal-group">
                <label htmlFor="edit-location">Location / Work Mode</label>
                <input
                  id="edit-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote, Bangalore, Hybrid"
                />
              </div>

              <div className="modal-group">
                <label htmlFor="edit-stipend">Stipend Package</label>
                <input
                  id="edit-stipend"
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="e.g. ₹45,000 / month"
                />
              </div>
            </div>

            <div className="modal-group">
              <label htmlFor="edit-notes">Notes, Rounds & Feedback</label>
              <textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Technical Round 1 scheduled for next Tuesday. DSA + System Design questions."
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn modal-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-internship-form"
            className="modal-btn modal-btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Changes →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditInternshipModal
