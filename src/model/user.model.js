import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";


// Mongoose Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    password: {
      type: String,
    },
    tierRanK: {
      type: Number,
    },
    tmcScore: {
      type: Number,
      default: 0
    },
    arvScore: {
      type: Number,
      default: 0
    },
    combinedScore: {
      type: Number,
    },
    leaderboardPosition: {
      type: Number,
      default: 0
    },
    completedTargets: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },
    emailVerified: {
        type: Boolean,
        default: false,
      },
      otp: {
        type: String,
        required: false,
      },
      otpExpiration: {
        type: Date,
        required: false,
      },
  },
  {
    timestamps: true
  }
);

// Password comparison method (bcrypt)
userSchema.methods.comparePassword = async function(password){
  if (!this.password) {
    throw new Error("Password not set for this user");
  }
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};


export const User = mongoose.model('User', userSchema);
