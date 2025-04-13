// models/workout.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WorkoutSchema = new Schema({
  workoutType: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  intensityLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String
  },
  notes: { 
    type: String 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Workout = mongoose.model('Workout', WorkoutSchema);
export default Workout;