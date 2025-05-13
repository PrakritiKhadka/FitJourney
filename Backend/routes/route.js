import express from 'express';
import {verifyLogin} from "../middleware/authMiddleware.js"
import { createOrUpdateProfile, getProfile } from "../service/profileService.js";
import { getUser, updateUser, getAllUsers, updateUserByAdmin, deleteUserByAdmin } from "../service/userService.js";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../service/goalService.js";
import { login, signUpWithEmail, signupWithGoogle } from '../service/authService.js';
import { logWorkout, getWorkouts } from "../service/workoutService.js";
import { 
  getBlogs, 
  getPublishedBlogs, 
  getBlogById,
  createBlog, 
  updateBlog, 
  deleteBlog, 
  togglePublish 
} from "../service/blogService.js";

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

// Admin User Management Routes
router.get('/admin/users', verifyLogin, getAllUsers);
router.put('/admin/users/:id', verifyLogin, updateUserByAdmin);
router.delete('/admin/users/:id', verifyLogin, deleteUserByAdmin);

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

// Routes for Blogs
router.get('/blogs', getBlogs);
router.get('/blogs/published', getPublishedBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.patch('/blogs/:id/publish', togglePublish);

export default router;