import express from 'express';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateProfile,
} from '../controllers/userController.js';
import User from '../models/User.js';

const router = express.Router();

// GET /profile — return authenticated user's info (no password)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /profile — update authenticated user's own profile
router.put('/profile', verifyToken, updateProfile);

// GET / — admin: list all users with filters and booking stats
router.get('/', verifyToken, adminOnly, getAllUsers);

// GET /:id — admin: get a single user with bookings and stats
router.get('/:id', verifyToken, adminOnly, getUserById);

// PUT /:id/status — admin: activate or ban a user
router.put('/:id/status', verifyToken, adminOnly, updateUserStatus);

// PUT /:id/role — admin: grant or revoke admin role
router.put('/:id/role', verifyToken, adminOnly, updateUserRole);

export default router;
