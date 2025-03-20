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
      type: Date,
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
        sessionEndTime: { type: Date },
      },
    ],
    challengeHistory: [
      {
        date: { type: Date, default: Date.now },
        score: { type: Number, required: true },
      },
    ],
    lastActive: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Middleware to update tier based on points
userSchema.pre("save", function (next) {
  const points = this.totalPoints;
  const tierTable = [
    { name: "NOVICE SEEKER", up: 1, retain: [0], down: null },
    { name: "INITIATE", up: 1, retain: [-29, 0], down: -30 },
    { name: "APPRENTICE", up: 31, retain: [1, 30], down: 0 },
    { name: "EXPLORER", up: 61, retain: [1, 60], down: 0 },
    { name: "VISIONARY", up: 81, retain: [31, 80], down: 30 },
    { name: "ADEPT", up: 101, retain: [31, 100], down: 30 },
    { name: "SEER", up: 121, retain: [61, 120], down: 60 },
    { name: "ORACLE", up: 141, retain: [61, 140], down: 60 },
    { name: "MASTER REMOTE VIEWER", up: 161, retain: [101, 160], down: 100 },
    { name: "ASCENDING MASTER", up: null, retain: [121], down: 120 },
  ];

  let currentTierIndex = tierTable.findIndex(
    (tier) => tier.name === this.tierRank
  );
  if (currentTierIndex === -1) {
    currentTierIndex = 0; // Default to NOVICE SEEKER if not found
  }

  let nextTier = tierTable[currentTierIndex + 1] || tierTable[currentTierIndex];
  let prevTier = tierTable[currentTierIndex - 1] || tierTable[currentTierIndex];

  if (points >= nextTier.up) {
    this.tierRank = nextTier.name;
  } else if (prevTier.down !== null && points <= prevTier.down) {
    this.tierRank = prevTier.name;
  }

  next();
});

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
