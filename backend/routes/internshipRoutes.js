import express from 'express'
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  getDashboardStats,
} from '../controllers/internshipController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All internship routes require authentication
router.use(protect)

router.route('/')
  .get(getInternships)
  .post(createInternship)

router.get('/stats', getDashboardStats)

router.route('/:id')
  .put(updateInternship)
  .delete(deleteInternship)

export default router
