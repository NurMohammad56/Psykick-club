import express from "express";
import { getUserProfile, updateUserPassword, updateUserProfile, getProfileCompleteness } from "../controller/profile.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-user/:id", verifyJWT, getUserProfile)
router.put("/update-profile/:id", verifyJWT, updateUserProfile)
router.put("/update-password/:id", verifyJWT, updateUserPassword)
router.get("/profile-completeness", verifyJWT, getProfileCompleteness)

export default router;