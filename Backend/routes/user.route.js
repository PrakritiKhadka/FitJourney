import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';
import auth from '../Middleware/auth.js';

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', userController.register);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userController.login);

// @route   POST api/users/google
// @desc    Login or register with Google
// @access  Public
router.post('/google', userController.googleAuth);

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getUser);

export default router;