import mongoose, { Schema } from "mongoose";

const UserSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    participatedTMCTargets: [
      {
        TMCId: {
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
        }
      }
    ],
    participatedARVTargets: [
      {
        ARVId: {
          type: Schema.Types.ObjectId,
          ref: "ARVTarget"
        },
        submittedImage: {
          type: String,
          default: ""
        },
        points: {
          type: Number,
        }
      }
    ],
  },
  { timestamps: true }
);

export const UserSubmission = mongoose.model(
  "UserSubmission",
  UserSubmissionSchema
);
