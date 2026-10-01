import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Internship from '../models/Internship.js'

// Helper: Generate JWT Token
const generateToken = (id, email, fullName) => {
  const secret = process.env.JWT_SECRET || 'skillbridge_jwt_secret_key_2026_academic_secure'
  return jwt.sign({ id, email, fullName }, secret, {
    expiresIn: '30d',
  })
}

// Helper: Seed sample starter internships for new user
const seedStarterInternships = async (userId) => {
  try {
    const existing = await Internship.countDocuments({ user: userId })
    if (existing > 0) return

    await Internship.insertMany([
      {
        user: userId,
        company: 'Google',
        role: 'Frontend Engineering Intern',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Interview',
        location: 'Bangalore (Hybrid)',
        stipend: '₹45,000 / month',
        notes: 'Technical round 1 scheduled for next Tuesday.',
      },
      {
        user: userId,
        company: 'Microsoft',
        role: 'Software Development Intern',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Applied',
        location: 'Hyderabad',
        stipend: '₹50,000 / month',
        notes: 'Submitted via campus placement portal.',
      },
      {
        user: userId,
        company: 'Infosys',
        role: 'Web Developer Intern',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Selected',
        location: 'Remote',
        stipend: '₹25,000 / month',
        notes: 'Offer letter received. Starting next summer.',
      },
    ])
  } catch (error) {
    console.warn('Starter internships seeding notice:', error.message)
  }
}

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email, password, course, college } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      })
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      })
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      course: course || '',
      college: college || '',
      skills: 'React, JavaScript, HTML, CSS',
      projects: 'SkillBridge Internship Tracker',
    })

    if (user) {
      // Seed default starter internship applications
      await seedStarterInternships(user._id)

      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.email, user.fullName),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          course: user.course,
          college: user.college,
          skills: user.skills,
          projects: user.projects,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user registration data.',
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during student registration.',
    })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.email, user.fullName),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          course: user.course,
          college: user.college,
          skills: user.skills,
          projects: user.projects,
        },
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during student login.',
    })
  }
}

// @desc    Get current student profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          course: user.course,
          college: user.college,
          skills: user.skills,
          projects: user.projects,
        },
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving student profile.',
    })
  }
}

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      })
    }

    user.fullName = req.body.fullName || user.fullName
    user.course = req.body.course !== undefined ? req.body.course : user.course
    user.college = req.body.college !== undefined ? req.body.college : user.college
    user.skills = req.body.skills !== undefined ? req.body.skills : user.skills
    user.projects = req.body.projects !== undefined ? req.body.projects : user.projects

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        course: updatedUser.course,
        college: updatedUser.college,
        skills: updatedUser.skills,
        projects: updatedUser.projects,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating student profile.',
    })
  }
}
