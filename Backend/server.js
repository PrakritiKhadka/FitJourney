// server.js - Main entry point for the fitness tracking app backend

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Route imports (use .js extension if necessary)
import authRoutes from './routes/Auth.js';
import userRoutes from './routes/user.route.js';
import profileRoutes from './routes/profile.route.js';
import workoutRoutes from './routes/workout.js';
// import nutritionRoutes from './routes/nutrition.js';
import goalRoutes from './routes/goal.route.js';
// import statsRoutes from './routes/stats.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const allowedOrigin = 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true // only if you're using cookies/auth sessions
}));
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB - fixed to use the correct database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/workouts', workoutRoutes);
// app.use('/api/nutrition', nutritionRoutes);
// app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is running');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});