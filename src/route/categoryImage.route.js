import express from "express";
import {
  createCategory,
  categoryWiseImageUpload,
  getCategoryImages,
  getSubCategoryImages,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  getAllImages,
  getCategoryAndSubCategoryNames
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Create Category Route from admin
router.post("/create", verifyJWT, isAdmin, createCategory);

// Upload Category Image from admin
router.post(
  "/upload-category-image",
  upload.single("image"),
  verifyJWT,
  isAdmin,
  categoryWiseImageUpload
);
// Get all category from admin
router.get("/get-all-category-images", verifyJWT, isAdmin, getAllCategories);

// Update Category By Id from admin
router.patch(
  "/update-category/:id",
  verifyJWT,
  isAdmin,
  upload.single("image"),
  updateCategoryById
);

// Delete Category By Id from admin
router.delete("/delete-category/:id", verifyJWT, isAdmin, deleteCategoryById);

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
  verifyJWT,
  isAdmin,
  getAllImages
);

// Get Category and Sub-Category Names
router.get("/get-category-and-subcategory-names", verifyJWT, getCategoryAndSubCategoryNames);

export default router;
