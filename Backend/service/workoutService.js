// service/workoutService.js
import Workout from '../models/workout.js';

export const logWorkout = async (req, res) => {
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

    const userId = req.user ? req.user._id : null;
    
    const newWorkout = new Workout({
      workoutType,
      duration: Number(duration), // Ensure duration is a number
      intensityLevel,
      date: new Date(date),
      time,
      notes,
      userId
    });

    const savedWorkout = await newWorkout.save();
    console.log('Workout saved:', savedWorkout);
    
    res.status(201).json({ 
      success: true, 
      message: 'Workout saved successfully',
      data: savedWorkout
    });
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save workout: ' + err.message 
    });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: workouts
    });
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workouts: ' + err.message
    });
  }
};

