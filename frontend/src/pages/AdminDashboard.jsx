import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import EditInternshipModal from '../components/EditInternshipModal'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    applied: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    placementRate: 0,
  })
  const [students, setStudents] = useState([])
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit modal state
  const [editingInternship, setEditingInternship] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Navigation tabs: 'overview' | 'students' | 'internships'
  const [activeTab, setActiveTab] = useState('overview')

  // Search & Filter controls
  const [studentSearch, setStudentSearch] = useState('')
  const [internshipSearch, setInternshipSearch] = useState('')
  const [internshipStatusFilter, setInternshipStatusFilter] = useState('All')

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError('')

      const [statsRes, studentsRes, internshipsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getStudents(),
        api.admin.getInternships(),
      ])

      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (studentsRes.success) {
        setStudents(studentsRes.data || [])
      }
      if (internshipsRes.success) {
        setInternships(internshipsRes.data || [])
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err)
      setError(err.message || 'Failed to load administrative data from the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleOpenEdit = (app) => {
    setEditingInternship(app)
    setEditModalOpen(true)
  }

  const handleCloseEdit = () => {
    setEditingInternship(null)
    setEditModalOpen(false)
  }

  const handleSaveEdit = async (id, updatedData) => {
    const res = await api.admin.updateInternship(id, updatedData)
    if (res.success && res.data) {
      setInternships((prev) =>
        prev.map((app) => (app._id === id ? res.data : app))
      )
    } else {
      setInternships((prev) =>
        prev.map((app) => (app._id === id ? { ...app, ...updatedData } : app))
      )
    }

    const statsRes = await api.admin.getStats()
    if (statsRes.success) {
      setStats(statsRes.data)
    }
  }

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students
    const query = studentSearch.toLowerCase()
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.college?.toLowerCase().includes(query) ||
        s.course?.toLowerCase().includes(query) ||
        s.skills?.toLowerCase().includes(query)
    )
  }, [students, studentSearch])

  // Filter internships
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const matchesStatus =
        internshipStatusFilter === 'All' ||
        item.status?.toLowerCase() === internshipStatusFilter.toLowerCase()

      const query = internshipSearch.toLowerCase().trim()
      const matchesSearch =
        !query ||
        item.company?.toLowerCase().includes(query) ||
        item.role?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.user?.fullName?.toLowerCase().includes(query) ||
        item.user?.email?.toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [internships, internshipStatusFilter, internshipSearch])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-inner">
          <div className="admin-loading">
            <div className="spinner"></div>
            <h2>Loading SkillBridge Administrator Dashboard...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Fetching live institutional analytics and student pipelines.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-inner">
        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="admin-badge">🛡️ Administrator Console</div>
            <h1>Institutional Admin Dashboard</h1>
            <p>Comprehensive overview of student accounts, application pipelines, and placement metrics.</p>
          </div>

          <div className="admin-header-actions">
            <div className="admin-user-pill">
              <span>👤</span>
              <span>{user?.fullName || 'SkillBridge Administrator'}</span>
            </div>
            <button className="refresh-btn" onClick={fetchAdminData} title="Reload Data">
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="admin-error-banner">
            <div>⚠️ {error}</div>
            <button onClick={fetchAdminData}>Retry</button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview & Analytics
          </button>
          <button
            className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👨‍🎓 Students Directory <span className="tab-badge">{students.length}</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'internships' ? 'active' : ''}`}
            onClick={() => setActiveTab('internships')}
          >
            💼 All Applications <span className="tab-badge">{internships.length}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="admin-section">
            {/* KPI Stat Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div>
                  <div className="admin-stat-title">Registered Students</div>
                  <div className="admin-stat-value">{stats.totalStudents}</div>
                </div>
                <div className="admin-stat-icon stat-icon-students">👨‍🎓</div>
              </div>

              <div className="admin-stat-card">
                <div>
                  <div className="admin-stat-title">Total Applications</div>
                  <div className="admin-stat-value">{stats.totalInternships}</div>
                </div>
                <div className="admin-stat-icon stat-icon-internships">📁</div>
              </div>

              <div className="admin-stat-card">
                <div>
                  <div className="admin-stat-title">Interviews Scheduled</div>
                  <div className="admin-stat-value">{stats.interview}</div>
                </div>
                <div className="admin-stat-icon stat-icon-interview">📅</div>
              </div>

              <div className="admin-stat-card">
                <div>
                  <div className="admin-stat-title">Offers / Selected</div>
                  <div className="admin-stat-value">{stats.selected}</div>
                </div>
                <div className="admin-stat-icon stat-icon-selected">🏆</div>
              </div>

              <div className="admin-stat-card">
                <div>
                  <div className="admin-stat-title">Placement Conversion</div>
                  <div className="admin-stat-value">{stats.placementRate}%</div>
                </div>
                <div className="admin-stat-icon stat-icon-rate">📈</div>
              </div>
            </div>

            {/* Application Pipeline Status Breakdown */}
            <h3 style={{ marginBottom: 14, color: 'var(--text-primary)', fontSize: 18 }}>
              Application Pipeline Distribution
            </h3>
            <div className="breakdown-row">
              <div className="breakdown-card">
                <span className="breakdown-label">
                  <span style={{ color: '#0284c7' }}>●</span> Applied
                </span>
                <span className="breakdown-count">{stats.applied}</span>
              </div>

              <div className="breakdown-card">
                <span className="breakdown-label">
                  <span style={{ color: '#d97706' }}>●</span> Under Interview
                </span>
                <span className="breakdown-count">{stats.interview}</span>
              </div>

              <div className="breakdown-card">
                <span className="breakdown-label">
                  <span style={{ color: '#16a34a' }}>●</span> Selected / Offered
                </span>
                <span className="breakdown-count">{stats.selected}</span>
              </div>

              <div className="breakdown-card">
                <span className="breakdown-label">
                  <span style={{ color: '#dc2626' }}>●</span> Rejected
                </span>
                <span className="breakdown-count">{stats.rejected}</span>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
              {/* Recent Students Preview */}
              <div className="table-card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text-primary)' }}>Recently Registered Students</h4>
                  <button
                    onClick={() => setActiveTab('students')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    View All →
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>College</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((s) => (
                        <tr key={s._id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-mini">
                                {s.fullName ? s.fullName.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div>
                                <span className="user-name">{s.fullName}</span>
                                <span className="user-email">{s.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>{s.college || '—'}</td>
                          <td>{formatDate(s.createdAt)}</td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                            No registered students found yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Applications Preview */}
              <div className="table-card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text-primary)' }}>Recent Internship Applications</h4>
                  <button
                    onClick={() => setActiveTab('internships')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    View All →
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company & Role</th>
                        <th>Applicant</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.slice(0, 5).map((app) => (
                        <tr key={app._id}>
                          <td>
                            <div className="company-title">{app.company}</div>
                            <div className="role-title">{app.role}</div>
                          </td>
                          <td>{app.user?.fullName || 'Student'}</td>
                          <td>
                            <span className={`status-badge ${app.status?.toLowerCase() || 'applied'}`}>
                              ● {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {internships.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                            No applications submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS DIRECTORY */}
        {activeTab === 'students' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <div>
                <h2 className="section-title">Students Directory</h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
                  Showing {filteredStudents.length} of {students.length} registered student accounts.
                </p>
              </div>

              <input
                type="text"
                className="search-box"
                placeholder="🔍 Search name, email, college..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            <div className="table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>College & Course</th>
                      <th>Skills</th>
                      <th>Projects</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-mini">
                              {s.fullName ? s.fullName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                              <span className="user-name">{s.fullName}</span>
                              <span className="user-email">{s.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{s.college || 'College not set'}</strong>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                            {s.course || 'Degree not specified'}
                          </div>
                        </td>
                        <td>
                          {s.skills ? (
                            <div className="skills-tags">
                              {s.skills.split(',').map((skill, idx) => (
                                <span key={idx} className="skill-tag">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>None listed</span>
                          )}
                        </td>
                        <td style={{ maxWidth: 220, fontSize: 13, color: 'var(--text-secondary)' }}>
                          {s.projects || '—'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                          {formatDate(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">👨‍🎓</div>
                  <h3>No student accounts found</h3>
                  <p>
                    {studentSearch
                      ? `No students match your search keyword "${studentSearch}".`
                      : 'There are currently no registered students in the system.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ALL INTERNSHIP APPLICATIONS */}
        {activeTab === 'internships' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <div>
                <h2 className="section-title">All Internship Applications</h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
                  Showing {filteredInternships.length} of {internships.length} total applications across all students.
                </p>
              </div>

              <input
                type="text"
                className="search-box"
                placeholder="🔍 Search company, role, applicant..."
                value={internshipSearch}
                onChange={(e) => setInternshipSearch(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ marginBottom: 18 }} className="filter-pills">
              {['All', 'Applied', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  className={`pill-btn ${internshipStatusFilter === status ? 'active' : ''}`}
                  onClick={() => setInternshipStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Company & Role</th>
                      <th>Applicant Student</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Stipend</th>
                      <th>Applied Date</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInternships.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div className="company-title">{app.company}</div>
                          <div className="role-title">{app.role}</div>
                        </td>
                        <td>
                          {app.user ? (
                            <div>
                              <strong style={{ color: 'var(--text-primary)' }}>{app.user.fullName}</strong>
                              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{app.user.email}</div>
                              {app.user.college && (
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{app.user.college}</div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Unknown Student</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${app.status?.toLowerCase() || 'applied'}`}>
                            ● {app.status}
                          </span>
                        </td>
                        <td>{app.location || 'Remote'}</td>
                        <td style={{ fontWeight: 600 }}>{app.stipend || '—'}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{app.date || formatDate(app.createdAt)}</td>
                        <td style={{ maxWidth: 220, fontSize: 13, color: 'var(--text-muted)' }}>
                          {app.notes || '—'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() => handleOpenEdit(app)}
                            title="Edit Application Details"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInternships.length === 0 && (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">💼</div>
                  <h3>No applications found</h3>
                  <p>
                    {internshipSearch || internshipStatusFilter !== 'All'
                      ? 'Try adjusting your search query or status filter.'
                      : 'No internship applications have been recorded in the platform.'}
                  </p>
                </div>
              )}
            </div>
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

export default AdminDashboard
