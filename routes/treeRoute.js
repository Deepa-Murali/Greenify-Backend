import express from 'express';
import Tree from '../models/tree.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// 🌱 POST /api/trees - Plant a new tree (only logged-in users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, imageUrl, location } = req.body;
    const newTree = new Tree({
      name,
      type,
      imageUrl,
      location,
      plantedBy: req.userId
    });

    const savedTree = await newTree.save();
    res.status(201).json(savedTree);
  } catch (err) {
    res.status(500).json({ msg: 'Error planting tree' });
  }
});

// 📍 GET /api/trees - Get all planted trees (public access)
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find().populate('plantedBy', 'name');
    res.json(trees);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching trees' });
  }
});

// 🌿 GET /api/trees/user - Get only logged-in user's trees
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const trees = await Tree.find({ plantedBy: req.userId }).populate('plantedBy', 'name');
    res.json(trees);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user trees' });
  }
});

// 🌳 PUT /api/trees/:treeId/growth - Add a growth update (only owner)
router.put('/:treeId/growth', authMiddleware, async (req, res) => {
  try {
    const { description, imageUrl, date } = req.body;
    const tree = await Tree.findById(req.params.treeId);

    if (!tree) return res.status(404).json({ msg: 'Tree not found' });

    if (tree.plantedBy.toString() !== req.userId)
      return res.status(403).json({ msg: 'Not authorized to update this tree' });

    tree.updates.push({ description, imageUrl, date });
    await tree.save();
    res.json(tree);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding growth update' });
  }
});

// 🔐 DELETE /api/trees/:id - Admin can delete any tree
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') return res.status(403).json({ msg: 'Only admin can delete trees' });

    await Tree.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Tree deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting tree' });
  }
});

// 🧹 DELETE /api/trees/:treeId/updates/:index - Admin can delete a specific growth update
router.delete('/:treeId/updates/:index', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admin can delete growth updates' });
    }

    const { treeId, index } = req.params;
    const tree = await Tree.findById(treeId);

    if (!tree) return res.status(404).json({ msg: 'Tree not found' });

    if (!tree.updates || tree.updates.length <= index) {
      return res.status(404).json({ msg: 'Update not found' });
    }

    // Remove the update at the specified index
    tree.updates.splice(index, 1);
    await tree.save();

    res.json({ msg: 'Growth update deleted successfully', tree });
  } catch (err) {
    console.error('Error deleting update:', err);
    res.status(500).json({ msg: 'Error deleting growth update' });
  }
});
// 📊 GET /api/trees/user-count - Count trees planted by current user
router.get('/user-count', authMiddleware, async (req, res) => {
  try {
    const count = await Tree.countDocuments({ plantedBy: req.userId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tree count' });
  }
});


export default router;
