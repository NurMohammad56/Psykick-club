import express from "express";
import { getUserProfile, updateUserPassword, updateUserProfile } from "../controller/profile.controller.js";

const router = express.Router();

router.get("/all-user", getUserProfile)
router.put("/update-user", updateUserProfile)
router.put("/password", updateUserPassword)

export default router;