import mongoose, { Schema } from "mongoose";

const ARVTargetSchema = new Schema(
  {
    code: {
      type: String,
      unique: true
    },
    eventName: {
      type: String
    },
    eventDescription: {
      type: String
    },
    revealTime: {
      type: Date
    },
    outcomeTime: {
      type: Date
    },
    image1: { url: { type: String, required: true }, description: { type: String, required: true } },
    image2: { url: { type: String, required: true }, description: { type: String, required: true } },
    image3: { url: { type: String, required: true }, description: { type: String, required: true } },
    controlImage: {
      type: String
    },
    userSubmittedImage: {
      type: String,
      default: ""
    },
    resultImage: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isQueued: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
)

export const ARVTarget = mongoose.model("ARVTarget", ARVTargetSchema);
