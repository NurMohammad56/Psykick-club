import express from "express";
import {
  createTermsCondition,
  getTermsCondition,
  updateTermsCondition
} from "../controller/termsCondition.controller.js";

const router = express.Router();

// CRUD Terms & Condition Route from admin
router.post(
  "/create-terms-and-condition",
  createTermsCondition
);
router.get("/get-terms-and-condition/:id", getTermsCondition);
router.patch(
  "/update-terms-and-condition/:id",
  updateTermsCondition
);

export default router;
