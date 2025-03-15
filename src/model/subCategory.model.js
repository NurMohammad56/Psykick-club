import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
