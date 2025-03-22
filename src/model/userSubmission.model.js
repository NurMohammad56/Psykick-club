import mongoose, { Schema } from "mongoose";

const UserSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    participatedTMCTargets: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "TMCTarget"
        },
        firstChoiceImage: {
          type: String,
          default: ""
        },
        secondChoiceImage: {
          type: String,
          default: ""
        },
        points: {
          type: Number,
        },
        successRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        pValue: {
          type: Number,
          default: 0,
          min: 0,
          max: 1,
        },
      }
    ],
    participatedARVTargets: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "ARVTarget"
        },
        submittedImage: {
          type: String,
          default: ""
        },
        points: {
          type: Number,
        },
        successRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        pValue: {
          type: Number,
          default: 0,
          min: 0,
          max: 1,
        },
      }
    ],
  },
  { timestamps: true }
);

export const UserSubmission = mongoose.model(
  "UserSubmission",
  UserSubmissionSchema
);
