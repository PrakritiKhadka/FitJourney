import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token);
    console.log('Decoded token:', decoded);
    
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: 'Token structure is invalid' });
    }
    
    // Check if user exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }
    
    // Add user id to request
    req.user = { id: decoded.user.id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token signature' });
    }
    
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;