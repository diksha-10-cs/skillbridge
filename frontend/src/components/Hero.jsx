import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import heroImg from '../assets/hero_illustration.jpg'
import './Hero.css'

function Hero() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const handleCtaClick = () => {
    if (!isAuthenticated) {
      navigate('/signup')
    } else if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-badge">
            <span>✨</span> Next-Gen Student Internship Portal
          </div>

          <h1>
            Track, Manage & Accelerate Your <span>Internship Journey</span>
          </h1>

          <p className="hero-description">
            Never miss an interview or deadline again. SkillBridge keeps your applications,
            recruiter communications, student profile, and placement milestones organized in real-time.
          </p>

          <div className="hero-cta-group">
            <button
              className="hero-btn-primary"
              onClick={handleCtaClick}
            >
              {isAuthenticated ? (user?.role === 'admin' ? 'Open Admin Panel →' : 'Go to Dashboard →') : 'Get Started Free →'}
            </button>

            <a href="#features" className="hero-btn-secondary">
              Explore Features ↓
            </a>
          </div>

          <div className="hero-trust-bar">
            <div className="trust-item">
              <span>🚀</span> 100% Free for Students
            </div>
            <div className="trust-item">
              <span>⚡</span> Real-Time Status Tracking
            </div>
            <div className="trust-item">
              <span>🔒</span> Secure MongoDB Sync
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-card">
            <img
              src={heroImg}
              alt="SkillBridge Internship & Placement Tracker Illustration"
              className="hero-image"
            />
            <div className="hero-floating-badge badge-top-left">
              <div className="badge-icon">🎉</div>
              <div>
                <div>Offer Received</div>
                <small style={{ color: '#059669' }}>Google Frontend Intern</small>
              </div>
            </div>
            <div className="hero-floating-badge badge-bottom-right">
              <div className="badge-icon">💼</div>
              <div>
                <div>Interview Scheduled</div>
                <small style={{ color: '#2563eb' }}>Microsoft SDE</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero