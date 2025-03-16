import express from "express";
import {
  createCategory,
  categoryWiseImageUpload,
  getCategoryImages
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Create Category Route
router.post("/create", verifyJWT, isAdmin, createCategory);

// Upload Category Image Route
router.post(
  "/upload-category-image",
  upload.single("image"),
  verifyJWT,
  isAdmin,
  categoryWiseImageUpload
);

// Get Category Images Route
router.get("/get-category-images/:categoryName", verifyJWT, getCategoryImages);

export default router;
