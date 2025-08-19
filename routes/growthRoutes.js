import express from 'express';
import Tree from '../models/tree.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// 📸 POST /api/growth/:treeId - Add growth update to a tree (only owner)
router.post('/:treeId', authMiddleware, async (req, res) => {
  try {
    const { description, imageUrl, date } = req.body;
    const tree = await Tree.findById(req.params.treeId);

    if (!tree) return res.status(404).json({ msg: 'Tree not found' });

    // Only tree owner can add update
    if (tree.plantedBy.toString() !== req.userId)
      return res.status(403).json({ msg: 'Unauthorized to update this tree' });

    tree.updates.push({ description, imageUrl, date });
    await tree.save();

    res.status(200).json({ msg: 'Growth update added', tree });
  } catch (err) {
    res.status(500).json({ msg: 'Error adding growth update' });
  }
});

// 🖼️ GET /api/growth/gallery - Get all updates (public view)
router.get('/gallery', async (req, res) => {
  try {
    const trees = await Tree.find().populate('plantedBy', 'name');
    const allUpdates = [];

    trees.forEach(tree => {
      tree.updates.forEach(update => {
        allUpdates.push({
          treeId: tree._id,
          treeName: tree.name,
          treeType: tree.type,
          plantedBy: tree.plantedBy.name,
          updateDescription: update.description,
          updateImage: update.imageUrl,
          updateDate: update.date
        });
      });
    });

    res.json(allUpdates);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching growth updates' });
  }
});

// 🧍 GET /api/growth/user - Get current user's updates
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const trees = await Tree.find({ plantedBy: req.userId });
    const userUpdates = [];

    trees.forEach(tree => {
      tree.updates.forEach(update => {
        userUpdates.push({
          treeId: tree._id,
          treeName: tree.name,
          updateDescription: update.description,
          updateImage: update.imageUrl,
          updateDate: update.date
        });
      });
    });

    res.json(userUpdates);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user updates' });
  }
});

export default router;
