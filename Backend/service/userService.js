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
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  // Save user to database
  return await userData.save();
};
