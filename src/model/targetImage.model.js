import mongoose, { Schema } from "mongoose";

const targetImageSchema = new Schema(
  {
    url: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export const TargetImage = mongoose.model("TargetImage", targetImageSchema);
