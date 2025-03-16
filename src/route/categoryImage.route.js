import express from "express";
import {
  createCategory,
  categoryWiseImageUpload,
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Create Category Route

router.post("/create", verifyJWT, isAdmin, createCategory);
router.post(
  "/upload-category-image",
  upload.single("image"),
  verifyJWT,
  isAdmin,
  categoryWiseImageUpload
);

export default router;
