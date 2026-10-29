import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Profile() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    course: '',
    college: '',
    skills: '',
    projects: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        course: user.course || '',
        college: user.college || '',
        skills: user.skills || '',
        projects: user.projects || '',
      })
    }
  }, [user])

  function handleChange(event) {
    const { name, value } = event.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setSuccessMsg('')
    setErrorMsg('')
  }

  const isAdmin = user?.role === 'admin'

  function handleCancel() {
    setIsEditing(false)
    setErrorMsg('')
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        course: user.course || '',
        college: user.college || '',
        skills: user.skills || '',
        projects: user.projects || '',
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setErrorMsg('')
      const updatedUser = await updateProfile(
        isAdmin
          ? { fullName: profileData.fullName.trim() }
          : {
              fullName: profileData.fullName.trim(),
              course: profileData.course.trim(),
              college: profileData.college.trim(),
              skills: profileData.skills.trim(),
              projects: profileData.projects.trim(),
            }
      )

      if (updatedUser) {
        setProfileData({
          fullName: updatedUser.fullName || '',
          email: updatedUser.email || '',
          course: updatedUser.course || '',
          college: updatedUser.college || '',
          skills: updatedUser.skills || '',
          projects: updatedUser.projects || '',
        })
      }

      setIsEditing(false)
      setSuccessMsg('Profile updated successfully in MongoDB database!')
    } catch (err) {
      console.error('Profile update failed:', err)
      setErrorMsg(err.message || 'Could not update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Parse comma-separated skills for pill presentation
  const skillTags = profileData.skills
    ? profileData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : []

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-brand-badge">
            {isAdmin ? '🛡️ Administrator Account' : '🎓 Student Portfolio & Profile'}
          </div>
          <h1>{isAdmin ? 'Admin Profile' : 'Student Credentials'}</h1>
          <p className="auth-subtitle">
            {isAdmin
              ? 'Administrator account credentials and role details'
              : 'Manage your degree, college, technical skill tags, and featured project links'}
          </p>
        </div>

        {successMsg && <div className="auth-success">✅ {successMsg}</div>}
        {errorMsg && <div className="auth-error">⚠️ {errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChange={handleChange}
                readOnly={!isEditing}
                onClick={() => {
                  if (!isEditing) setIsEditing(true)
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Registered Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={profileData.email}
                disabled={true}
              />
            </div>
          </div>

          {isAdmin ? (
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                type="text"
                name="role"
                value="Admin"
                disabled={true}
              />
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="course">Degree / Major</label>
                  <input
                    id="course"
                    type="text"
                    name="course"
                    placeholder="e.g. B.Sc Computer Science / B.Tech IT"
                    value={profileData.course}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    onClick={() => {
                      if (!isEditing) setIsEditing(true)
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="college">College / University</label>
                  <input
                    id="college"
                    type="text"
                    name="college"
                    placeholder="Enter your college or university"
                    value={profileData.college}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    onClick={() => {
                      if (!isEditing) setIsEditing(true)
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="skills">Technical Skills (Comma separated)</label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Node.js, Python, MongoDB, SQL, Tailwind"
                  value={profileData.skills}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  onClick={() => {
                    if (!isEditing) setIsEditing(true)
                  }}
                />

                {!isEditing && skillTags.length > 0 && (
                  <div className="skills-tags-list">
                    {skillTags.map((skill, index) => (
                      <span key={index} className="skill-tag-pill">
                        💻 {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="projects">Featured Projects & Live Demos</label>
                <textarea
                  id="projects"
                  name="projects"
                  rows={3}
                  placeholder="e.g. SkillBridge Internship Portal, StudyFlow Task Manager"
                  value={profileData.projects}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  onClick={() => {
                    if (!isEditing) setIsEditing(true)
                  }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {isEditing ? (
              <>
                <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Saving to Database...' : 'Save Profile Changes'}
                </button>
                <button
                  type="button"
                  className="auth-btn auth-btn-secondary"
                  style={{ flex: 0.6 }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="auth-btn"
                style={{ flex: 1 }}
                onClick={() => setIsEditing(true)}
              >
                {isAdmin ? '✏️ Edit Profile' : '✏️ Edit Student Information'}
              </button>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <Link to={isAdmin ? '/admin' : '/dashboard'}>
            ← Back to {isAdmin ? 'Admin Panel' : 'Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile