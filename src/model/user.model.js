import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    screenName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    streetAddress: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
    },
    password: {
      type: String,
    },
    tierRank: {
      type: String,
      enum: [
        "novice seeker",
        "initiate",
        "apprentice",
        "explorer",
        "visionary",
        "adept",
        "seer",
        "oracle",
        "master remote viewer",
        "ascending master",
      ],
      default: "novice seeker",
    },
    totalPoints: {
      type: Number,
      default: 0,
      index: true,
    },
    tmcScore: [
      {
        type: Number,
      },
    ],
    arvScore: [
      {
        type: Number,
      },
    ],
    leaderboardPosition: {
      type: Number,
      default: 0,
      index: true,
    },
    completedTargets: {
      type: Number,
      default: 0,
    },
    targetsLeft: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    pValue: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    timeLeft: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    sessions: [
      {
        sessionStartTime: {
          type: Date,
          default: Date.now,
        },
        sessionEndTime: Date,
      },
    ],
    lastActive: Date,
  },
  {
    timestamps: true,
  }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // const salt = await this.getSalt(10);
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method (bcrypt)
userSchema.methods.isPasswordValid = function (password) {
  if (!password || !this.password) {
    throw new Error("Password or hashed password is missing");
  }

  return bcrypt.compare(password, this.password);
};

// Generate ACCESS_TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate REFRESH_TOKEN
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
