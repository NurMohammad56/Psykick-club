import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, forgotPassword, verifyOtp, resendOTP, resetPassword, startSession, endSession, sendHeartbeat, updateUserPoints } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

// Register User Route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-access-token", verifyJWT, refreshAccessToken);
router.post("/forget-password", verifyJWT, forgotPassword);
router.post("/verifyOTP", verifyJWT, verifyOtp);
router.post("/resendOTP", verifyJWT, resendOTP);
router.post("/reset-password", verifyJWT, resetPassword);

// Track the user time
router.post("/start-session",verifyJWT, startSession);
router.post("/end-session",verifyJWT, endSession);
router.post("/heartbeat",verifyJWT, sendHeartbeat);

// Update game points with tier rank
router.patch("/update-points",verifyJWT, updateUserPoints);







export default router;
