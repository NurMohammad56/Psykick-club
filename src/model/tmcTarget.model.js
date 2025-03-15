import mongoose, { Schema } from "mongoose";

const TmcTargetSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    targetImage: {
      type: Schema.Types.ObjectId,
      ref: "TargetImage",
      required: true,
    },
    controlImages: [
      { type: Schema.Types.ObjectId, ref: "ControlImage", required: true },
    ],
    expiration: { type: Date, required: true },
    revealTime: { type: Date, required: true },
  },
  { timestamps: true }
);

export const TmcTarget = mongoose.model("TmcTarget", TmcTargetSchema);
