import mongoose, { Schema } from "mongoose";

const TMCTargetSchema = new Schema(
  {
    code: {
      type: String,
      unique: true
    },
    targetImage: {
      type: Schema.Types.ObjectId,
      ref: "CategoryImage"
    },
    controlImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "CategoryImage"
      },
    ],
    revealTime: { type: Date },
    isActive: {
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
  },
  { timestamps: true }
)

export const TMCTarget = mongoose.model("TMCTarget", TMCTargetSchema);
