import { useEffect, useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import EditInternshipModal from '../components/EditInternshipModal'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Guard: Admin users must not be shown the student dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const [internships, setInternships] = useState([])
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, selected: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  // Edit modal state
  const [editingInternship, setEditingInternship] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [internshipsRes, statsRes] = await Promise.all([
        api.internships.getAll(),
        api.internships.getStats(),
      ])

      if (internshipsRes.success) {
        setInternships(internshipsRes.data)
      }
      if (statsRes.success) {
        setStats(statsRes.data)
      }
      setError('')
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load applications from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      setInternships((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      )

      await api.internships.update(id, { status: newStatus })

      const statsRes = await api.internships.getStats()
      if (statsRes.success) {
        setStats(statsRes.data)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      alert(`Could not update status: ${err.message}`)
      fetchData()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship application?')) {
      return
    }

    try {
      await api.internships.delete(id)
      setInternships((prev) => prev.filter((app) => app._id !== id))

      const statsRes = await api.internships.getStats()
      if (statsRes.success) {
        setStats(statsRes.data)
      }
    } catch (err) {
      console.error('Failed to delete application:', err)
      alert(`Could not delete application: ${err.message}`)
    }
  }

  const handleOpenEdit = (app) => {
    setEditingInternship(app)
    setEditModalOpen(true)
  }

  const handleCloseEdit = () => {
    setEditingInternship(null)
    setEditModalOpen(false)
  }

  const handleSaveEdit = async (id, updatedData) => {
    const res = await api.internships.update(id, updatedData)
    if (res.success && res.data) {
      setInternships((prev) =>
        prev.map((app) => (app._id === id ? res.data : app))
      )
    } else {
      setInternships((prev) =>
        prev.map((app) => (app._id === id ? { ...app, ...updatedData } : app))
      )
    }

    const statsRes = await api.internships.getStats()
    if (statsRes.success) {
      setStats(statsRes.data)
    }
  }

  const filteredInternships = internships.filter((app) => {
    const matchesFilter =
      selectedFilter === 'All' || app.status.toLowerCase() === selectedFilter.toLowerCase()
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.fullName || 'Student'}! 👋</h1>
          <p>Here is your real-time internship application pipeline and interview schedule.</p>
        </div>

        {/* Profile Summary Card with Avatar */}
        {user && (
          <div className="profile-summary-card">
            <div className="profile-avatar-group">
              <div className="profile-avatar">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="profile-info">
                <h3>{user.fullName}</h3>
                <div className="profile-details">
                  <span><strong>Course:</strong> {user.course || 'Degree not set'}</span>
                  <span><strong>College:</strong> {user.college || 'College not set'}</span>
                  {user.skills && <span><strong>Skills:</strong> {user.skills}</span>}
                </div>
              </div>
            </div>
            <Link to="/profile" className="edit-profile-btn">
              ✏️ View / Edit Profile
            </Link>
          </div>
        )}

        {/* 4 Interactive KPI Stat Cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card card-total">
            <div>
              <div className="card-title">Total Applications</div>
              <div className="card-value">{stats.total}</div>
            </div>
            <div className="card-icon">📁</div>
          </div>

          <div className="dashboard-card card-interview">
            <div>
              <div className="card-title">Interviews Scheduled</div>
              <div className="card-value">{stats.interview}</div>
            </div>
            <div className="card-icon">📅</div>
          </div>

          <div className="dashboard-card card-selected">
            <div>
              <div className="card-title">Offers / Selected</div>
              <div className="card-value">{stats.selected}</div>
            </div>
            <div className="card-icon">🏆</div>
          </div>

          <div className="dashboard-card card-rejected">
            <div>
              <div className="card-title">Rejected</div>
              <div className="card-value">{stats.rejected}</div>
            </div>
            <div className="card-icon">❌</div>
          </div>
        </div>

        {/* Filter Chips, Search Input & Add Button */}
        <div className="dashboard-actions-bar">
          <div className="filters-group">
            {[
              { label: 'All', count: stats.total },
              { label: 'Applied', count: stats.applied },
              { label: 'Interview', count: stats.interview },
              { label: 'Selected', count: stats.selected },
              { label: 'Rejected', count: stats.rejected },
            ].map(({ label, count }) => (
              <button
                key={label}
                className={`filter-btn ${selectedFilter === label ? 'active' : ''}`}
                onClick={() => setSelectedFilter(label)}
              >
                <span>{label}</span>
                <span className="filter-count">{count}</span>
              </button>
            ))}
          </div>

          <div className="actions-right">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="add-internship-button"
              onClick={() => navigate('/add-internship')}
            >
              + Add Internship
            </button>
          </div>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        {/* Applications List */}
        {loading ? (
          <div style={{ padding: '60px 20px', color: '#64748b' }}>
            <p style={{ fontSize: 18, fontWeight: 600 }}>Loading your applications from MongoDB...</p>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No applications found</h3>
            <p>
              {searchTerm || selectedFilter !== 'All'
                ? 'Try adjusting your search keywords or active filter.'
                : "You haven't tracked any internship applications yet."}
            </p>
            <button
              className="add-internship-button"
              onClick={() => navigate('/add-internship')}
            >
              + Record Your First Internship Application
            </button>
          </div>
        ) : (
          <div className="applications-container">
            {filteredInternships.map((app) => (
              <div className="application-card" key={app._id}>
                <div className="app-header-row">
                  <div className="company-logo-avatar">
                    {app.company ? app.company.charAt(0).toUpperCase() : '💼'}
                  </div>

                  <div className="app-main-info">
                    <h3>{app.company}</h3>
                    <div className="app-role">{app.role}</div>

                    <div className="app-meta">
                      <span>📅 Applied: {app.date}</span>
                      {app.location && <span>📍 {app.location}</span>}
                      {app.stipend && <span>💰 Stipend: {app.stipend}</span>}
                    </div>

                    {app.notes && (
                      <div className="app-notes">
                        <strong>Note:</strong> {app.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="app-controls">
                  <select
                    className={`status-select status-${app.status}`}
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  >
                    <option value="Applied">● Applied</option>
                    <option value="Interview">● Interview</option>
                    <option value="Selected">● Selected</option>
                    <option value="Rejected">● Rejected</option>
                  </select>

                  <button
                    className="edit-button"
                    onClick={() => handleOpenEdit(app)}
                    title="Edit Application Details"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(app._id)}
                    title="Delete Application"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Application Details Modal */}
        <EditInternshipModal
          isOpen={editModalOpen}
          internship={editingInternship}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  )
}

export default Dashboard