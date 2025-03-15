import mongoose, { Schema } from "mongoose";

const arvTargetSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    eventName: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      required: true
    },
    revealTime: {
      type: Date,
      required: true
    },
    outcomeTime: {
      type: Date,
      required: true
    },
    image1: { url: { type: String, required: true }, description: { type: String, required: true } },
    image2: { url: { type: String, required: true }, description: { type: String, required: true } },
    image3: { url: { type: String, required: true }, description: { type: String, required: true } },
    controlImage: {
      type: String,
      required: true
    },
    resultImage: {
      type: String
    },
  },
  { timestamps: true }
);

export const TmcTarget = mongoose.model("TmcTarget", TmcTargetSchema);
