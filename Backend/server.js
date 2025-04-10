import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/user.route.js";
import profileRoutes from "./routes/profile.route.js";
import workoutRoutes from "./routes/workout.js";
import goalRoutes from "./routes/goal.route.js";
import { connectDB } from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(bodyParser.json());

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/profiles", profileRoutes);
    app.use("/api/goals", goalRoutes);
    app.use("/api/workouts", workoutRoutes);

    app.get("/", (req, res) => res.send("Fitness Tracker API is running"));
    app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

    // Error Handling Routes
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`--------------------------------------------------`);
      console.log(`|                                                 |`);
      console.log(`|             FIT JOURNEY BACKEND                 |`);
      console.log(`|                                                 |`);
      console.log(`|        Server running on port ${PORT}              |`);
      console.log(`--------------------------------------------------`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
