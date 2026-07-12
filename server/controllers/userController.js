import User from '../models/User.js';
import Booking from '../models/Booking.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, status, role } = req.query;

    const filterStage = {};

    if (search) {
      filterStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'active') {
      filterStage.isActive = { $ne: false };
    } else if (status === 'banned') {
      filterStage.isActive = false;
    }

    if (role === 'admin') {
      filterStage.isAdmin = true;
    } else if (role === 'user') {
      filterStage.isAdmin = false;
    }

    const aggregationPipeline = [
      { $match: filterStage },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'userId',
          as: 'bookings',
        },
      },
      {
        $addFields: {
          bookingsCount: { $size: '$bookings' },
          totalSpent: { $sum: '$bookings.totalPrice' },
        },
      },
      { $project: { password: 0, bookings: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [
      { $match: filterStage },
      { $count: 'total' },
    ];

    const [users, countResult] = await Promise.all([
      User.aggregate(aggregationPipeline),
      User.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;
    const pages = Math.ceil(total / limit);

    res.json({ users, total, page, pages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ userId: id })
      .populate('packageId', 'title destination price')
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;

    res.json({
      user,
      bookings,
      stats: { totalBookings, totalSpent, confirmedBookings },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.userId === id) {
      return res.status(400).json({ message: 'Cannot ban yourself' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true, select: '-password' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.userId === id) {
      return res.status(400).json({ message: 'Cannot change own admin role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isAdmin } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, oldPassword, newPassword } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar !== undefined) updateFields.avatar = avatar;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Old password is required to set a new password' });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      updateFields.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
