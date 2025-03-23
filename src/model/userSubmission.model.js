import mongoose, { Schema } from "mongoose";

const UserSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participatedTMCTargets: [
      {
        id: {
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
        id: {
          type: Schema.Types.ObjectId,
          ref: "ARVTarget",
        },
        submittedImage: {
          type: String,
          default: "",
        },
        points: {
          type: Number,
        },
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
