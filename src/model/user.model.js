import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
    },
    tierRank: {
      type: Number,
      default: 0,
    },
    point: {
      type: Number,
      default: 0,
    },
    tmcScore: {
      type: Number,
      default: 0,
      index: true,
    },
    arvScore: {
      type: Number,
      default: 0,
      index: true,
    },
    combinedScore: {
      type: Number,
      default: 0,
      index: true,
    },
    leaderboardPosition: {
      type: Number,
      default: 0,
      index: true,
    },
    completedTargets: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
      required: false,
    },
    otpExpiration: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
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

  return bcrypt.compare(this.password, password);
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
