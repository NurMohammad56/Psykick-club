import express from 'express';
import {adminLogin, forgotPassword, verifyOtp, resendOTP, resetPassword, updateAdminProfile} from "../controller/admin.controller.js"
import {isAdmin} from "../middleware/role.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js"
const router = express.Router();

// Admin Login Route
router.post("/login", adminLogin);
router.post("/forget-password", verifyJWT, forgotPassword);
router.post("/verifyOTP", verifyJWT, verifyOtp);
router.post("/resendOTP", verifyJWT, resendOTP);
router.post("/reset-password", verifyJWT, resetPassword);

// Admin Profile Route
router.patch("/profile", verifyJWT, isAdmin, upload.single("avatar"), updateAdminProfile);




export default router;