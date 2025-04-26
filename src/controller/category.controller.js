import { CategoryImage } from "../model/categoryImage.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDestroy.util.js";

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

// get all categories from admin
const getAllCategories = async (_, res) => {
  try {
    const categories = await CategoryImage.find({});
    if (!categories.length) {
      return res
        .status(404)
        .json({ status: false, message: "No categories found" });
    }
    return res.status(200).json({
      status: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.log("Error getting categories image:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

//  Get just category and subcategory names
const getCategoryAndSubCategoryNames = async (req, res) => {
  try {
    const categories = await CategoryImage.find({}, { _id: 0, __v: 0 });
    if (!categories.length) {
      return res
        .status(404)
        .json({ status: false, message: "No categories found" });
    }
    const categoryNames = categories.map((category) => ({
      categoryName: category.categoryName,
      subCategoryNames: category.subCategories.map(
        (subCategory) => subCategory.name
      ),
    }));
    return res.status(200).json({
      status: true,
      message: "All categories fetched successfully",
      data: categoryNames,
    });
  } catch (error) {
    console.log("Error getting categories image:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// update a category form admin
const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName, subCategoryName } = req.body;

    // Find the category by ID
    let category = await CategoryImage.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    // Update category name if provided
    if (categoryName) {
      category.categoryName = categoryName;
    }

    // Find the first subcategory
    let subCategory = category.subCategories[0];
    if (!subCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    // Update subcategory name if provided
    if (subCategoryName) {
      subCategory.name = subCategoryName;
    }

    // Upload new image if provided
    if (req.file) {
      // Upload to Cloudinary
      const cloudinaryUpload = await uploadOnCloudinary(req.file.buffer, {
        resource_type: "auto",
      });

      // Delete old Cloudinary image if exists
      if (subCategory.images.length > 0) {
        const oldImageUrl = subCategory.images[0].imageUrl;
        const publicId = oldImageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }

      // Update subcategory image
      subCategory.images = [{ imageUrl: cloudinaryUpload.secure_url }];
    }

    // Save updated category
    await category.save();

    return res.status(200).json({
      status: true,
      message: "Update successful",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// delete a category from admin
const deleteCategoryById = async (req, res, next) => {
  const { id, imageId, subCategoryName } = req.params;

  try {
    const category = await CategoryImage.findById(id);
    if (!category) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    // Find the subCategory
    const subCategoryIndex = category.subCategories.findIndex(
      (subCat) => subCat.name === subCategoryName
    );

    if (subCategoryIndex === -1) {
      return res.status(404).json({ status: false, message: "Subcategory not found" });
    }

    const subCategory = category.subCategories[subCategoryIndex];

    // Find the image
    const imageIndex = subCategory.images.findIndex(
      (img) => img._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ status: false, message: "Image not found" });
    }

    // Delete from Cloudinary
    const publicId = subCategory.images[imageIndex].imageUrl
      .split("/")
      .pop()
      .split(".")[0];

    await deleteFromCloudinary(publicId);

    // Remove the image
    subCategory.images.splice(imageIndex, 1);

    // If no images left, remove the subCategory
    if (subCategory.images.length === 0) {
      category.subCategories.splice(subCategoryIndex, 1);
    }

    // If no subCategories left, delete the whole category
    if (category.subCategories.length === 0) {
      await CategoryImage.findByIdAndDelete(id);
      return res.status(200).json({ status: true, message: "Image deleted successfully" });
    }

    // Otherwise, save the updated document
    await category.save();

    return res.status(200).json({
      status: true,
      message: "Image deleted successfully"
    });
  }

  catch (error) {
    next(error);
  }
};


// get category image for frontend
const getCategoryImages = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const category = await CategoryImage.findOne({ categoryName });
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Did not find category",
      });
    }

    // Default pagination values
    const itemsPerPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    // Loop through subcategories and paginate their images
    const paginatedSubCategories = category.subCategories.map((subCategory) => {
      const totalItems = subCategory.images.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const validPage = Math.max(1, Math.min(currentPage, totalPages));

      const startIndex = (validPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedImages = subCategory.images.slice(startIndex, endIndex);

      return {
        name: subCategory.name,
        images: paginatedImages,
        MetaPagination: {
          currentPage: validPage,
          totalPages,
          totalItems,
          itemsPerPage,
        },
      };
    });

    return res.status(200).json({
      status: true,
      message: "Category images fetched successfully",
      data: paginatedSubCategories,
    });
  } catch (error) {
    next(error);
  }
};

// get sub category images for frontend
const getSubCategoryImages = async (req, res, next) => {
  try {
    const { categoryName, subCategoryName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const category = await CategoryImage.findOne({ categoryName });
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Did not find category",
      });
    }

    const subCategory = category.subCategories.find(
      (subCat) => subCat.name === subCategoryName
    );

    if (!subCategory) {
      return res.status(404).json({
        status: false,
        message: "Did not find sub category",
      });
    }

    // Default pagination values
    const itemsPerPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    // Pagination calculations
    const totalItems = subCategory.images.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const validPage = Math.max(1, Math.min(currentPage, totalPages));

    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedImages = subCategory.images.slice(startIndex, endIndex);

    return res.status(200).json({
      status: true,
      message: "Sub category images fetched successfully",
      data: [
        {
          name: subCategory.name,
          images: paginatedImages,
          MetaPagination: {
            currentPage: validPage,
            totalPages,
            totalItems,
            itemsPerPage,
          },
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

const getAllImages = async (req, res, next) => {
  try {
    const categories = await CategoryImage.find();

    const allImages = [];

    categories.forEach(category => {
      category.subCategories.forEach(sub => {
        sub.images.forEach(img => {
          allImages.push({
            imageId: img._id,
            categoryId: category._id,
            categoryName: category.categoryName,
            subcategoryName: sub.name,
            image: img.imageUrl
          });
        });
      });
    });

    return res.status(200).json({
      status: true,
      data: allImages,
      message: "All images fetched successfully by category and subcategory"
    });

  } catch (error) {
    next(error);
  }
};



export {
  createCategory,
  categoryWiseImageUpload,
  getCategoryImages,
  getSubCategoryImages,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  getAllImages,
  getCategoryAndSubCategoryNames
};
