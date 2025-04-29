import express from "express";
import {
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
} from "../controller/privacyPolicy.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CRUD Privacy Policy Route from admin
router.post("/create-privacy-policy/:previousId", createPrivacyPolicy);
router.get("/get-privacy-policies", getPrivacyPolicies);
router.patch(
  "/update-privacy-policy/:id",
  updatePrivacyPolicy
);
router.delete(
  "/delete-privacy-policy/:id",
  deletePrivacyPolicy
);

// Get Privacy Policy Route from user
router.get("/privacy-policy-user", verifyJWT, getPrivacyPolicies);

export default router;
