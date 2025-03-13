import express from "express";
import { getUserProfile, updateUserPassword, updateUserProfile } from "../controller/profile.controller.js";

const router = express.Router();

router.get("/:id", getUserProfile)
router.put("/", updateUserProfile)
router.put("/password", updateUserPassword)

export default router;