import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';
import Tree from '../models/tree.js';

const router = express.Router();

// 👤 GET /api/users/profile - Logged-in user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching profile' });
  }
});

// 🛡️ GET /api/users - Admin can view all users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// ❌ DELETE /api/users/:id - Admin can delete a user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user' });
  }
});
// 👤 GET /api/users/profile - Logged-in user's profile with planted tree count
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const treeCount = await Tree.countDocuments({ plantedBy: req.userId }); // ✅ Count user's trees

    res.json({ ...user.toObject(), treeCount }); // ✅ Add treeCount to response
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching profile' });
  }
});

export default router;
