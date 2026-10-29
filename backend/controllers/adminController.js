import mongoose from 'mongoose'
import User from '../models/User.js'
import Internship from '../models/Internship.js'

// @desc    Get system-wide metrics and status breakdown
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalInternships, allInternships] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Internship.countDocuments(),
      Internship.find({}, 'status'),
    ])

    const applied = allInternships.filter((item) => item.status === 'Applied').length
    const interview = allInternships.filter((item) => item.status === 'Interview').length
    const selected = allInternships.filter((item) => item.status === 'Selected').length
    const rejected = allInternships.filter((item) => item.status === 'Rejected').length

    const placementRate = totalInternships > 0
      ? Number(((selected / totalInternships) * 100).toFixed(1))
      : 0

    return res.json({
      success: true,
      data: {
        totalStudents,
        totalInternships,
        applied,
        interview,
        selected,
        rejected,
        placementRate,
      },
    })
  } catch (error) {
    console.error('Error fetching admin statistics:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving administrator statistics.',
    })
  }
}

// @desc    Get all registered student profiles without password hashes
// @route   GET /api/admin/students
// @access  Private (Admin only)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })

    return res.json({
      success: true,
      count: students.length,
      data: students,
    })
  } catch (error) {
    console.error('Error fetching student list:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving student directory.',
    })
  }
}

// @desc    Get all internship applications across all students
// @route   GET /api/admin/internships
// @access  Private (Admin only)
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('user', 'fullName email college course')
      .sort({ createdAt: -1 })

    return res.json({
      success: true,
      count: internships.length,
      data: internships,
    })
  } catch (error) {
    console.error('Error fetching admin internships:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving internship applications.',
    })
  }
}

// @desc    Update any internship application status or details (Admin override)
// @route   PUT /api/admin/internships/:id
// @access  Private (Admin only)
export const adminUpdateInternship = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship application ID format.',
      })
    }

    const internship = await Internship.findById(id)

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship application not found.',
      })
    }

    const { company, role, date, status, location, stipend, notes } = req.body

    const validStatuses = ['Applied', 'Interview', 'Selected', 'Rejected']
    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed values are: ${validStatuses.join(', ')}.`,
      })
    }

    if (company !== undefined) internship.company = company.trim()
    if (role !== undefined) internship.role = role.trim()
    if (date !== undefined) internship.date = date
    if (status !== undefined) internship.status = status
    if (location !== undefined) internship.location = location.trim()
    if (stipend !== undefined) internship.stipend = stipend.trim()
    if (notes !== undefined) internship.notes = notes.trim()

    const updatedInternship = await internship.save()
    await updatedInternship.populate('user', 'fullName email college course')

    return res.json({
      success: true,
      message: 'Internship application updated successfully by administrator.',
      data: updatedInternship,
    })
  } catch (error) {
    console.error('Error updating internship by admin:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error updating internship application.',
    })
  }
}

// @desc    Delete any internship application (Admin override)
// @route   DELETE /api/admin/internships/:id
// @access  Private (Admin only)
export const adminDeleteInternship = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship application ID format.',
      })
    }

    const internship = await Internship.findById(id)

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship application not found.',
      })
    }

    await internship.deleteOne()

    return res.json({
      success: true,
      message: 'Internship application removed successfully by administrator.',
      id,
    })
  } catch (error) {
    console.error('Error deleting internship by admin:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error deleting internship application.',
    })
  }
}
