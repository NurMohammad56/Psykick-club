import mongoose, { Schema } from "mongoose";
const UserSubmissionTmcSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: "TmcTarget",
      required: true,
    },
    submittedDrawing: {
      type: String,
      required: true,
    },
    selectedImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true,
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const UserSubmissionTmc = mongoose.model(
  "UserSubmissionTmc",
  UserSubmissionTmcSchema
);
