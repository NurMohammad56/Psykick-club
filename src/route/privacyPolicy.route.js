import express from "express";
import {createPrivacyPolicy} from "../controller/privacyPolicy.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {isAdmin} from "../middleware/role.middleware.js"

const router = express.Router();

router.post("/create-privacy-policy", verifyJWT, isAdmin, createPrivacyPolicy)


export default router;