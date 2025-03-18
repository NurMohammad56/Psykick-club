import mongoose, { Schema } from "mongoose";

const activeTargetsSchema = new Schema(
    {
        ARVTargetId: {
            type: Schema.Types.ObjectId,
            ref: "ARVTarget"
        },
        TMCTargetId: {
            type: Schema.Types.ObjectId,
            ref: "TMCTarget"
        }
    }
)

export const ActiveTargets = mongoose.model("ActiveTargets", activeTargetsSchema);