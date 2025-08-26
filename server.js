import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import treeRoutes from './routes/treeRoute.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Corrected route base paths
app.use('/api/auth', authRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Clear port message
mongoose.connect(process.env.MONGO_URI, { dbName: 'yourDatabaseName' })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
