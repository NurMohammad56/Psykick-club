import express from 'express';
import { adminLogin, forgotPassword, verifyOtp, resendOTP, resetPassword, updateAdminProfile, changePasswordAdmin, getGameParticipationStats, getAverageSessionDuration, getProfileCompleteness, getUserSessionDurations, getAllUsers, getActiveUsersCount, getContactUs } from "../controller/admin.controller.js"
import { getCompletedTargets } from "../controller/userSubmission.controller.js"
import { isAdmin } from "../middleware/role.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
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
router.get("/profile-completeness", verifyJWT, isAdmin, getProfileCompleteness);


// Change Password Route
router.patch("/change-password", verifyJWT, isAdmin, changePasswordAdmin);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DASHBOARD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Get session duration
router.get("/session-durations/:userId", verifyJWT, isAdmin, getUserSessionDurations);
router.get("/average-session-duration", verifyJWT, isAdmin, getAverageSessionDuration);
// Get all users
router.get("/all-users", verifyJWT, isAdmin, getAllUsers);
// Get active users count
router.get("/active-users-count", verifyJWT, isAdmin, getActiveUsersCount);

// Get game participation stats
router.get("/game-graph", verifyJWT, isAdmin, getGameParticipationStats);

// Get completed targets for a user
router.get('/completedTargets/:userId', getCompletedTargets);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CONTACT US>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/all-contact-us", verifyJWT, isAdmin, getContactUs);




export default router;