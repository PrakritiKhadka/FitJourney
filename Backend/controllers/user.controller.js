import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  try {
    const { name, age, gender, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Validate age
    if (age < 13) {
      return res.status(400).json({ message: 'You must be at least 13 years old to register.' });
    }
    
    // Create new user
    user = new User({
      name,
      age,
      gender,
      email,
      password,
      authMethod: 'local' // Add this to match your schema
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user to database
    await user.save();
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user and token (excluding password)
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.status(201).json({
      token,
      user: userToReturn
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user and token (excluding password)
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.json({
      token,
      user: userToReturn
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// In user.controller.js - update the googleAuth function

const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    if (!tokenId) {
      return res.status(400).json({
        message: 'No token provided',
      });
    }

    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const { email, name, sub: googleId } = payload;
      
      // Check if the user already exists
      let user = await User.findOne({ 
        $or: [{ email }, { googleId }] 
      });

      if (!user) {
        // Create a new user
        user = new User({
          name: name || 'Google User',
          email,
          age: 18, // Default age
          gender: 'prefer-not-to-say', // Default gender
          authMethod: 'google',
          googleId,
          // No password needed for Google auth
        });
        
        await user.save();
      } else if (user.authMethod === 'local') {
        // Update existing local user with Google ID
        user.googleId = googleId;
        user.authMethod = 'google';
        await user.save();
      }

      // Generate JWT
      const jwtPayload = {
        user: {
          id: user.id
        }
      };
      
      const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });

      // Return user object without sensitive data
      const userToReturn = { ...user.toObject() };
      delete userToReturn.password;

      res.json({
        token,
        user: userToReturn
      });
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({ message: 'Invalid Google token' });
    }

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { register, login, googleAuth, getUser };