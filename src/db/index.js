import mongoose from "mongoose";
import dotenv from "dotenv";
import { initCronJobs } from "../utils/cronJobs.util.js";

dotenv.config();

export const dbconfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("MongoDB connected");
      initCronJobs();
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
