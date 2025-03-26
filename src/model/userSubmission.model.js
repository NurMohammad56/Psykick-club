import mongoose, { Schema } from "mongoose";

const UserSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participatedTMCTargets: [
      {
        TMCId: {
          type: Schema.Types.ObjectId,
          ref: "TMCTarget",
        },
        firstChoiceImage: {
          type: String,
          default: "",
        },
        secondChoiceImage: {
          type: String,
          default: "",
        },
        points: {
          type: Number,
        },
      },
    ],
    participatedARVTargets: [
      {
        ARVId: {
          type: Schema.Types.ObjectId,
          ref: "ARVTarget",
        },
        submittedImage: {
          type: String,
          default: "",
        },
        points: {
          type: Number,
          default: 0,
        },
        submittedAt: {
          type: Date,
          default: Date.now
        },
        resultChecked: {
          type: Boolean,
          default: false
        }
      },
    ],
    completedChallenges: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    lastChallengeDate: {
      type: Date,
    },
    tierRank: {
      type: String,
      default: "NOVICE SEEKER",
    },
  },
  { timestamps: true }
);

export const UserSubmission = mongoose.model(
  "UserSubmission",
  UserSubmissionSchema
);
