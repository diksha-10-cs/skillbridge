import express from 'express'
import {
  getAdminStats,
  getAllStudents,
  getAllInternships,
  adminUpdateInternship,
  adminDeleteInternship,
} from '../controllers/adminController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Enforce both JWT authentication and admin role authorization on all Admin routes
router.use(protect, requireAdmin)

// @route   GET /api/admin/stats
router.get('/stats', getAdminStats)

// @route   GET /api/admin/students
router.get('/students', getAllStudents)

// @route   GET /api/admin/internships
router.get('/internships', getAllInternships)

// @route   PUT /api/admin/internships/:id
// @route   DELETE /api/admin/internships/:id
router.route('/internships/:id')
  .put(adminUpdateInternship)
  .delete(adminDeleteInternship)

export default router
