import express from 'express'
import { verifyToken, adminOnly } from '../middleware/auth.js'
import {
  submitReview,
  getPackageReviews,
  getAllReviews,
  moderateReview,
  getUserReviews,
} from '../controllers/reviewController.js'

const router = express.Router()

// Specific paths before param-based paths
router.get('/user/me', verifyToken, getUserReviews)
router.get('/package/:packageId', getPackageReviews)
router.get('/', verifyToken, adminOnly, getAllReviews)
router.post('/', verifyToken, submitReview)
router.put('/:id/moderate', verifyToken, adminOnly, moderateReview)

export default router
