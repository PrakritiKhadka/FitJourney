// routes/workout.js
import express from 'express';
import Workout from '../models/workout.js';

const router = express.Router();

// POST: Save new workout
router.post('/add', async (req, res) => {
  try {
    console.log('Received workout data:', req.body);
    const { workoutType, duration, intensityLevel, date, time, notes } = req.body;
    
    // Validate required fields
    if (!workoutType || !duration || !intensityLevel || !date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields are missing' 
      });
    }

    const newWorkout = new Workout({
      workoutType,
      duration: Number(duration),
      intensityLevel,
      date: new Date(date),
      time,
      notes,
    });

    await newWorkout.save();
    console.log('Workout saved:', newWorkout);
    res.status(201).json({ 
      success: true, 
      message: 'Workout saved successfully' 
    });
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save workout: ' + err.message 
    });
  }
});

export default router;