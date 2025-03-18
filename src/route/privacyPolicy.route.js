import express from "express";
import {createPrivacyPolicy, getPrivacyPolicies} from "../controller/privacyPolicy.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {isAdmin} from "../middleware/role.middleware.js"

const router = express.Router();

// CRUD Privacy Policy Route from admin
router.post("/create-privacy-policy", verifyJWT, isAdmin, createPrivacyPolicy)
router.get("/get-privacy-policies", getPrivacyPolicies)


export default router;