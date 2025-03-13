import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

// Register User Route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-access-token", verifyJWT, refreshAccessToken);






export default router;
