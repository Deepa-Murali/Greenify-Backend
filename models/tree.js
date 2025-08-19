import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  description: String,
  imageUrl: String,
  date: Date,
});

const treeSchema = new mongoose.Schema({
  name: String,
  type: String,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
  },
  plantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updates: [updateSchema]
});

export default mongoose.model('Tree', treeSchema);
