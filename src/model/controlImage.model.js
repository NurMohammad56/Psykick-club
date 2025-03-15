import mongoose, { Schema } from "mongoose";

const controlImageSchema = new Schema(
  {
    url: { type: String, required: true },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const ControlImage = mongoose.model("ControlImage", controlImageSchema);
