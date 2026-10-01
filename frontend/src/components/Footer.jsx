import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>🎓</span> Skill<span>Bridge</span>
          </Link>
          <p>
            The dedicated internship & campus placement portal designed for engineering,
            computing, and management students to conquer their career milestones.
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <a href="/#features">Key Features</a>
            <a href="/#how-it-works">How It Works</a>
            <Link to="/login">Student Sign In</Link>
            <Link to="/signup">Register Free Account</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>Architecture</h3>
          <div className="footer-links">
            <span>⚛️ React 19 Frontend</span>
            <span>⚡ Express REST API</span>
            <span>🍃 MongoDB Mongoose ODM</span>
            <span>🔐 Secure JWT Auth</span>
            <span>📊 Real-Time Analytics</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SkillBridge - Built for Student Internship & Placement Success.</p>
      </div>
    </footer>
  )
}

export default Footer