import express from "express";
import {
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy
} from "../controller/privacyPolicy.controller.js";

const router = express.Router();

// CRUD Privacy Policy Route from admin
router.post("/create-privacy-policy", createPrivacyPolicy);
router.get("/get-privacy-policies", getPrivacyPolicies);
router.patch(
  "/update-privacy-policy/:id",
  updatePrivacyPolicy
);

export default router;
