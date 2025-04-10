// profile.route.js
import express from 'express';
const router = express.Router();
import profileController from '../controllers/profile.controller.js';
import auth from '../middleware/auth.js';

// @route   GET api/profiles
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, profileController.getProfile);

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, profileController.createOrUpdateProfile);

export default router;  // Use default export
