import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        message: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

export const Notification = mongoose.model("Notification", notificationSchema);