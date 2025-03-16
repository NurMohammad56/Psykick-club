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
      ref: "CategoryImage",
      required: true,
    },
    controlImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "CategoryImage",
        required: true,
      },
    ],
    outcomeTime: { type: Date, required: true },
    revealTime: { type: Date, required: true },
    isCompleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export const TmcTarget = mongoose.model("TmcTarget", TmcTargetSchema);
