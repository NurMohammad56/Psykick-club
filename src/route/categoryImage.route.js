import express from "express";
import {
  createCategory,
  categoryWiseImageUpload,
  getSubCategoriesByCategory,
  getCategoryImages,
  getSubCategoryImages,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  getAllImages,
  getCategoryAndSubCategoryNames,
  updateImageIsUsedStatus,
  getAllUsedImages
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Create Category Route from admin
router.post("/create", createCategory);

// Upload Category Image from admin
router.post(
  "/upload-category-image",
  upload.single("image"),
  categoryWiseImageUpload
);
// Get all category from admin
router.get("/get-all-category", getAllCategories);

// Update Category By Id from admin
router.patch(
  "/update-category/:id",
  upload.single("image"),
  updateCategoryById
);

// Get Sub-Categories By Category
router.get("/get-subcategories/:categoryName", getSubCategoriesByCategory);

// Delete Category By Id from admin
router.delete("/delete-category/:id/:imageId/:subCategoryName", deleteCategoryById);

// Get Category Images Route for frontend
router.get("/get-category-images/:categoryName", verifyJWT, getCategoryImages);

// Get Sub-Category Images Route fro frontend
router.get(
  "/get-subcategory-images/:categoryName/:subCategoryName",
  verifyJWT,
  getSubCategoryImages
);

//Get all images
router.get(
  "/get-all-images",
  getAllImages
);

// Get Category and Sub-Category Names
router.get("/get-category-and-subcategory-names", getCategoryAndSubCategoryNames);

// get all used images
router.get("/get-all-used-images", verifyJWT, isAdmin, getAllUsedImages);

// update the image isUsed status
router.patch("/update-image-status/:categoryId/:imageId", verifyJWT, isAdmin, updateImageIsUsedStatus);

export default router;
