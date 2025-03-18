import mongoose, { Schema } from "mongoose";

const completedTargetsSchema = new Schema(
    {
        ARVTargets: [
            {
                type: Schema.Types.ObjectId,
                ref: "ARVTarget"
            }
        ],
        TMCTargets: [
            {
                type: Schema.Types.ObjectId,
                ref: "TMCTarget"
            }
        ],
    }
)

export const CompletedTargets = mongoose.model("CompletedTargets", completedTargetsSchema);