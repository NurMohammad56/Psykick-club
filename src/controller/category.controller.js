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

// create category from admin
const createCategory = async (req, res) => {
  const { categoryName, subCategoryName } = req.body;

  // Validate input
  if (!categoryName || !subCategoryName) {
    return res.status(400).json({ error: "Please fill category name" });
  }

  try {
    // Create or find category and subcategory
    const category = await createCategoryAndSubCategory(
      categoryName,
      subCategoryName
    );

    return res.json({
      status: true,
      message: "Category is created successfully",
      data: category,
    });
  } catch (error) {
    console.log("Error creating category", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// category wise image upload from admin
const categoryWiseImageUpload = async (req, res) => {
  try {
    const { categoryName, subCategoryName } = req.body;

    if (!categoryName || !subCategoryName || !req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Please fill everything" });
    }

    // Cloudinary upload
    const clodinaryUpload = await uploadOnCloudinary(req.file.buffer, {
      resource_type: "auto",
    });

    const imageUrl = clodinaryUpload?.secure_url;

    // Find category
    let category = await CategoryImage.findOne({ categoryName });

    if (!category)
      return res
        .status(404)
        .json({ status: false, message: "Did not find category" });

    // Find subcategory
    let subCategory = category.subCategories.find(
      (sc) => sc.name === subCategoryName
    );

    if (!subCategory)
      return res
        .status(404)
        .json({ status: false, message: "Did not find the sub category" });

    // Add image URL
    subCategory.images.push({ imageUrl });

    // Save updated category
    await category.save();

    return res.json({
      status: true,
      message: "Image upload completed successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// get category image for frontend
const getCategoryImages = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await CategoryImage.findOne({ categoryName });
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Did not find category" });
    }
    return res.status(200).json({
      status: true,
      message: "Category images fetched successfully",
      data: category.subCategories,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// get sub category images for frontend
const getSubCategoryImages = async (req, res) => {
  try {
    const { categoryName, subCategoryName } = req.params;
    const category = await CategoryImage.findOne({ categoryName });
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Did not find the category" });
    }
    const subCategory = category.subCategories.find(
      (subCat) => subCat.name === subCategoryName
    );
    if (!subCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Did not find sub category" });
    }
    return res
      .status(200)
      .json({
        status: false,
        message: "Sub category image fetch successfully",
        data: subCategory.images,
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export { createCategory, categoryWiseImageUpload, getCategoryImages, getSubCategoryImages };
