import mongoose, { Schema } from "mongoose";

const UserSubmissionTMCSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    firstChoice: {
      type: Schema.Types.ObjectId,
      ref: "CategoryImage"
    },
    secondChoice: {
      type: Schema.Types.ObjectId,
      ref: "CategoryImage"
    },
    TMCTarget: {
      type: Schema.Types.ObjectId,
      ref: "TMCTarget"
    }
  },
  { timestamps: true }
);

export const UserSubmissionTMC = mongoose.model(
  "UserSubmissionTMC",
  UserSubmissionTMCSchema
);
