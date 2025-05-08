import express from "express";
import {
  createTermsCondition,
  getTermsCondition,
  updateTermsCondition
} from "../controller/termsCondition.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CRUD Terms & Condition Route from admin
router.post(
  "/create-terms-and-condition",
  verifyJWT,
  isAdmin,
  createTermsCondition
);
router.get("/get-terms-and-condition/:id", getTermsCondition);
router.patch(
  "/update-terms-and-condition/:id",
  verifyJWT,
  isAdmin,
  updateTermsCondition
);

export default router;
