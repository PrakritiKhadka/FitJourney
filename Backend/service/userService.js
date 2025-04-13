import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
  try {
    var user = req.user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (err) {
    console.info(`User with email: ${email} does not exist`);
    return null;
  }
};

export const createUser = async (userData) => {
  if (userData.password) {
    // Hash password only for non-Google signups
    const salt = process.env.PASSWORD_SALT || "RTxD+XMmfNSHh5$da2At";
    var hashedPassword = await bcrypt.hashSync(userData.password + salt); // shows await is useless but is needed
    userData.password = hashedPassword;
  }

  // Save user to database
  return await userData.save();
};

// Add this new function
export const updateUser = async (req, res) => {
  try {
    const { name, email, age, gender } = req.body;
    
    // Build user update object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (age !== undefined) userFields.age = age === '' ? null : age;
    if (gender) userFields.gender = gender;
    
    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Don't allow email change for Google-authenticated users
    if (req.user.authMethod === 'google' && email && email !== req.user.email) {
      return res.status(400).json({ 
        message: 'Email cannot be changed for Google-authenticated accounts' 
      });
    }
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: userFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};