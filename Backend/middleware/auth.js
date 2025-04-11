import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { getPayload } from "../utils/googleUtil.js";

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token);
    console.log("Decoded token:", decoded);

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: "Token structure is invalid" });
    }

    // Check if user exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Add user id to request
    req.user = { id: decoded.user.id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Provide more specific error messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature" });
    }

    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;

export const getTokenData = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "No authentication token provided, access denied" });
  }

  try {
    return getPayload(token);
  } catch (err) {
    return res.status(500).json({
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }
};
