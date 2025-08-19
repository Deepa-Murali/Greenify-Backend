import Tree from '../models/treeModel.js';
import User from '../models/user.js';

// Submit new tree
export const addTree = async (req, res) => {
  try {
    const newTree = new Tree({
      ...req.body,
      userId: req.userId,
    });
    const saved = await newTree.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Tree creation failed', error: err.message });
  }
};

// Get all trees
export const getTrees = async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trees', error: err.message });
  }
};

// Add a growth update
export const addGrowthUpdate = async (req, res) => {
  try {
    const { description, imageUrl, date } = req.body;

    const tree = await Tree.findById(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Tree not found' });

    const user = await User.findById(req.userId);

    const update = {
      description,
      imageUrl,
      date: date || new Date(),
      userId: req.userId,
      username: user.name,
    };

    tree.updates.push(update);
    await tree.save();

    res.status(201).json({ message: 'Update added', update });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add update', error: err.message });
  }
};

// Return all growth updates (for gallery)
export const getAllUpdates = async (req, res) => {
  try {
    const trees = await Tree.find();
    const updates = [];

    trees.forEach(tree => {
      tree.updates.forEach(update => {
        updates.push({
          ...update._doc,
          treeId: tree._id,
          treeName: tree.treeName,
        });
      });
    });

    // GET all users
router.get('/all-users', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

  const users = await User.find({ role: 'user' });
  res.json(users);
});

// GET all trees (already in your treeRoute)


    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch updates', error: err.message });
  }
};
