import express from 'express';
import User from '../models/user.js';
import Tree from '../models/tree.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  next();
};

// 🔐 GET all users (admin only)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// 🗑 DELETE a user (admin only)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user' });
  }
});

// 🌳 GET all trees (admin only)
router.get('/trees', authMiddleware, isAdmin, async (req, res) => {
  try {
    const trees = await Tree.find().populate('plantedBy', 'name');
    res.json(trees);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching trees' });
  }
});

// 🌲 DELETE a tree (admin only)
router.delete('/trees/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await Tree.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Tree deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting tree' });
  }
});

export default router;
