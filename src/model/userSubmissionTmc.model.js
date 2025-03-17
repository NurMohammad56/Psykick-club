import mongoose, { Schema } from "mongoose";

const UserSubmissionTMCSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    firstChoiceImage: {
      type: String
    },
    secondChoiceImage: {
      type: String
    },
    TMCTargetId: {
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
