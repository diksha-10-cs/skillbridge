import interviewImg from '../assets/interview_prep.jpg'
import skillsImg from '../assets/skills_portfolio.jpg'
import './Features.css'

function Features() {
  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="features-header">
          <span className="features-pill">Empowering Student Careers</span>
          <h2>Everything You Need to Land Your Dream Internship</h2>
          <p>
            SkillBridge replaces messy spreadsheets and forgotten email threads with an intelligent,
            structured internship management ecosystem.
          </p>
        </div>

        {/* Feature Spotlight 1: Interview Prep & Tracking */}
        <div className="feature-spotlight">
          <div className="spotlight-image-wrapper">
            <img
              src={interviewImg}
              alt="Interview tracking and preparation system"
              className="spotlight-image"
            />
          </div>
          <div className="spotlight-content">
            <div className="spotlight-tag">📊 STAGE-BY-STAGE PIPELINE</div>
            <h3>Never Lose Track of an Interview Schedule</h3>
            <p>
              Organize every company application with dynamic pipeline statuses: Applied, Interview Scheduled,
              Offer Received, or Rejected. Keep custom notes, referral details, and stipend packages logged in one secure place.
            </p>
            <ul className="spotlight-checklist">
              <li>
                <span className="check-icon">✓</span> Real-time status toggle with instant database sync
              </li>
              <li>
                <span className="check-icon">✓</span> Track stipend packages and hybrid/remote work locations
              </li>
              <li>
                <span className="check-icon">✓</span> Interview rounds reminder and recruiter feedback log
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Spotlight 2: Skills & Student Portfolio */}
        <div className="feature-spotlight reverse">
          <div className="spotlight-image-wrapper">
            <img
              src={skillsImg}
              alt="Student skills profile and portfolio showcase"
              className="spotlight-image"
            />
          </div>
          <div className="spotlight-content">
            <div className="spotlight-tag">🎓 ACADEMIC & PROFESSIONAL CREDENTIALS</div>
            <h3>Unified Student Profile for Campus Placements</h3>
            <p>
              Showcase your degree, university credentials, technical skill tags, and featured project links.
              Update your skills anytime and keep your resume highlights ready for campus placement rounds.
            </p>
            <ul className="spotlight-checklist">
              <li>
                <span className="check-icon">✓</span> Course & university details synced with student dashboard
              </li>
              <li>
                <span className="check-icon">✓</span> Highlight key technical stacks (React, Python, Node, SQL)
              </li>
              <li>
                <span className="check-icon">✓</span> Direct link to top portfolio repositories and live demos
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Quick Cards Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">⚡</div>
            <h4>Instant Analytics</h4>
            <p>
              Live dashboard counters show your application velocity, interview conversion rate, and offers received.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">🔍</div>
            <h4>Smart Search & Filters</h4>
            <p>
              Instantly search through dozens of applications by company name, role, or filter by interview stage.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">🛡️</div>
            <h4>Secure & Persistent</h4>
            <p>
              Your data is safely backed up with MongoDB and secured with industry-standard bcrypt and JWT auth.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features