import mongoose, { Schema } from "mongoose";

const categoryImageSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  subCategories: [
    {
      name: {
        type: String,
        required: true,
      },
      images: [
        {
          imageUrl: String
        },
      ],
    },
  ],
});

export const CategoryImage = mongoose.model(
  "CategoryImage",
  categoryImageSchema
);
