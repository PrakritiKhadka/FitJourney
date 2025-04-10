// models/workout.js
import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  workoutType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  intensityLevel: {  // This matches your frontend form
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model('Workout', workoutSchema);