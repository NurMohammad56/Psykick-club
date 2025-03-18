import mongoose from "mongoose";
import dotenv from "dotenv";
import { startCronJob } from "../utils/cronJobs.util.js";

dotenv.config();

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
