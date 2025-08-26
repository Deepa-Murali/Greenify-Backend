import express from 'express';
import treeRoutes from './routes/treeRoute.js';

const app = express();

app.use(express.json());
app.use('/api/trees', treeRoutes); 
app.use("/uploads", express.static("uploads"));
