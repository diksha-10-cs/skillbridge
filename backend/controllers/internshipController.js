import Internship from '../models/Internship.js'

// @desc    Get all internships for current user
// @route   GET /api/internships
// @access  Private
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ user: req.user._id }).sort({
      createdAt: -1,
    })

    res.json({
      success: true,
      count: internships.length,
      data: internships,
    })
  } catch (error) {
    console.error('Error fetching internships:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching internship applications.',
    })
  }
}

// @desc    Create a new internship application
// @route   POST /api/internships
// @access  Private
export const createInternship = async (req, res) => {
  try {
    const { company, role, date, status, location, stipend, notes } = req.body

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both company name and role.',
      })
    }

    const internship = await Internship.create({
      user: req.user._id,
      company: company.trim(),
      role: role.trim(),
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Applied',
      location: location || 'Remote',
      stipend: stipend || '',
      notes: notes || '',
    })

    res.status(201).json({
      success: true,
      message: 'Internship application created successfully.',
      data: internship,
    })
  } catch (error) {
    console.error('Error creating internship:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating internship application.',
    })
  }
}

// @desc    Update internship application (status, info, notes)
// @route   PUT /api/internships/:id
// @access  Private
export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship application not found.',
      })
    }

    // Verify ownership
    if (internship.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this internship application.',
      })
    }

    const { company, role, date, status, location, stipend, notes } = req.body

    if (company !== undefined) internship.company = company.trim()
    if (role !== undefined) internship.role = role.trim()
    if (date !== undefined) internship.date = date
    if (status !== undefined) internship.status = status
    if (location !== undefined) internship.location = location
    if (stipend !== undefined) internship.stipend = stipend
    if (notes !== undefined) internship.notes = notes

    const updatedInternship = await internship.save()

    res.json({
      success: true,
      message: 'Internship application updated successfully.',
      data: updatedInternship,
    })
  } catch (error) {
    console.error('Error updating internship:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating internship application.',
    })
  }
}

// @desc    Delete internship application
// @route   DELETE /api/internships/:id
// @access  Private
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship application not found.',
      })
    }

    // Verify ownership
    if (internship.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this internship application.',
      })
    }

    await internship.deleteOne()

    res.json({
      success: true,
      message: 'Internship application deleted successfully.',
      id: req.params.id,
    })
  } catch (error) {
    console.error('Error deleting internship:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting internship application.',
    })
  }
}

// @desc    Get dashboard metrics & summary
// @route   GET /api/internships/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const all = await Internship.find({ user: req.user._id })

    const stats = {
      total: all.length,
      applied: all.filter((item) => item.status === 'Applied').length,
      interview: all.filter((item) => item.status === 'Interview').length,
      selected: all.filter((item) => item.status === 'Selected').length,
      rejected: all.filter((item) => item.status === 'Rejected').length,
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching dashboard stats.',
    })
  }
}
