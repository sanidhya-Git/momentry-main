import express from 'express';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import { getRevenueAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/revenue', verifyToken, adminOnly, getRevenueAnalytics);

export default router;
