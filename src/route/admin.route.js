import express from 'express';
import {adminLogin, forgotPassword, verifyOtp, resendOTP, resetPassword} from "../controller/admin.controller.js"
import {isAdmin} from "../middleware/role.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Login Route
router.post("/login", adminLogin);
router.post("/forget-password", verifyJWT, forgotPassword);
router.post("/verifyOTP", verifyJWT, verifyOtp);
router.post("/resendOTP", verifyJWT, resendOTP);
router.post("/reset-password", verifyJWT, resetPassword);



export default router;