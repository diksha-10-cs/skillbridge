import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HowItWorks.css'

function HowItWorks() {
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
    <section id="how-it-works" className="how-it-works">
      <div className="how-container">
        <div className="how-header">
          <span className="how-pill">Simple 3-Step Process</span>
          <h2>How SkillBridge Powers Your Success</h2>
          <p>
            From your very first application to your final accepted job offer,
            SkillBridge gives you clarity and confidence at every step.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon-wrapper">📝</div>
            <h3>Create Student Profile</h3>
            <p>
              Sign up in seconds and fill out your degree, college, technical skill stack,
              and featured project links for campus placement visibility.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon-wrapper">💼</div>
            <h3>Log Applications</h3>
            <p>
              Add internship applications as you apply. Set company name, position role,
              work mode (Remote / Hybrid), and deadline dates.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon-wrapper">🎯</div>
            <h3>Ace Your Interviews</h3>
            <p>
              Update your application pipeline as you get invited to interview rounds,
              record recruiter feedback notes, and celebrate your job offers!
            </p>
          </div>
        </div>

        <div className="how-cta-banner">
          <div>
            <h3>Ready to Supercharge Your Internship Hunt?</h3>
            <p>Join students organizing their placement journey on SkillBridge.</p>
          </div>
          <button
            className="how-cta-btn"
            onClick={handleCtaClick}
          >
            {isAuthenticated ? (user?.role === 'admin' ? 'Open Admin Panel →' : 'Open Dashboard →') : 'Sign Up Free Today →'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks