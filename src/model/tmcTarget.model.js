import mongoose, { Schema } from "mongoose";

const TMCTargetSchema = new Schema(
  {
    code: {
      type: String,
      unique: true
    },
    targetImage: {
      type: String
    },
    controlImages: [
      {
        type: String
      },
    ],
    revealTime: { type: Date },
    bufferTime: {
      type: Date
    },
    gameTime: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isPartiallyActive: {
      type: Boolean,
      default: false
    },
    isQueued: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["pending", "queued", "active", "revealed", "completed"],
      default: "pending"
    },
  },
  { timestamps: true }
)

export const TMCTarget = mongoose.model("TMCTarget", TMCTargetSchema);
