import mongoose from "mongoose";
import dotenv from "dotenv";
import { startCronJob } from "../utils/cronJobs.util.js";
import { getUserSessionDurations } from "../controller/user.controller.js";

dotenv.config();

// Just for testing
const userId = "67d677c180f7032652ae53e1";
getUserSessionDurations(userId)
  .then((sessionDurations) => {
    console.log("User session durations:", sessionDurations);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

export const dbconfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("MongoDB connected");
      startCronJob();
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
