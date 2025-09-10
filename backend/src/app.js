import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import calcRoutes from './routes/calcRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calculations', calcRoutes);
app.use('/api/profiles', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Carbon Calculator API is running!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;