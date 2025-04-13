import express from 'express';
import {verifyLogin} from "../middleware/authMiddleware.js"
import { createOrUpdateProfile, getProfile } from "../service/profileService.js";
import { getUser, updateUser  } from "../service/userService.js";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../service/goalService.js";
import { login, signUpWithEmail, signupWithGoogle } from '../service/authService.js';
import { logWorkout, getWorkouts } from "../service/workoutService.js";

const router = express.Router();

// Routes for auth
router.post('/signup/email', signUpWithEmail);
router.post('/signup/google', signupWithGoogle);
router.post('/login', login);

// Routes for users
router.post('/users/register');
router.get('/users/me', verifyLogin, getUser);
router.put('/users/me', verifyLogin, updateUser); // Updated to use the new controller function
router.put('/users/profile', verifyLogin, createOrUpdateProfile); // Keep this for fitness profile data
router.delete('/users/delete');

// Routes for profile
router.get('/profiles', verifyLogin, getProfile);
router.post('/profiles', verifyLogin, createOrUpdateProfile);
router.put('/profiles', verifyLogin, createOrUpdateProfile);
router.delete('/profiles')

// Routes for goals
router.get('/goals', verifyLogin, getGoals);
router.post('/goals', verifyLogin, createGoal);
router.put('/goals/:id', verifyLogin, updateGoal);
router.delete('/goals/:id', verifyLogin, deleteGoal);

// Routes for Workout
router.post('/workouts', verifyLogin, logWorkout);
router.get('/workouts', verifyLogin, getWorkouts);
export default router;