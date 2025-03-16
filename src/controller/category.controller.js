import { CategoryImage } from "../model/categoryImage.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

// helper
const createCategoryAndSubCategory = async (categoryName, subCategoryName) => {
  let category = await CategoryImage.findOne({ categoryName });

  // If category doesn't exist, create a new one
  if (!category) {
    category = new CategoryImage({ categoryName, subCategories: [] });
  }

  let subCategory = category.subCategories.find(
    (sc) => sc.name === subCategoryName
  );

  // If subcategory doesn't exist, create a new one
  if (!subCategory) {
    subCategory = { name: subCategoryName, images: [] };
    category.subCategories.push(subCategory);
  }

  // Save category with subcategory
  await category.save();
  return category;
};

const createCategory = async (req, res) => {
  const { categoryName, subCategoryName } = req.body;

  // Validate input
  if (!categoryName || !subCategoryName) {
    return res
      .status(400)
      .json({ error: "Please fill category name" });
  }

  try {
    // Create or find category and subcategory
    const category = await createCategoryAndSubCategory(
      categoryName,
      subCategoryName
    );

    res.json({
      message: "Category is created successfully",
      category,
    });
  } catch (error) {
    console.log("Error creating category", error);
    res.status(500).json({status: false, message: error.message });
  }
};

export { createCategory };
