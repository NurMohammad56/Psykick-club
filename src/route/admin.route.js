import express from 'express';
import { adminLogin, forgotPassword, verifyOtp, resendOTP, resetPassword, updateAdminProfile, changePasswordAdmin, getGameParticipationStats, getAdminProfile, getAverageSessionDuration, getProfileCompleteness, getUserSessionDurations, getAllUsers, getActiveUsersCount, getContactUs } from "../controller/admin.controller.js"
import { getCompletedTargets } from "../controller/userSubmission.controller.js"
import { getAllCompletedTargets, getAllCompletedTargetsCount } from "../controller/completedTargets.controller.js"
import { isAdmin } from "../middleware/role.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js"
const router = express.Router();

// Admin Login Route
router.post("/login", adminLogin);
router.post("/forget-password", forgotPassword);
router.post("/verifyOTP", verifyOtp);
router.post("/resendOTP", resendOTP);
router.post("/reset-password", resetPassword);

// Admin Profile Route
router.patch("/profile", verifyJWT, isAdmin, upload.single("avatar"), updateAdminProfile);
router.get("/get-profile", verifyJWT, isAdmin, getAdminProfile);
router.get("/profile-completeness", verifyJWT, isAdmin, getProfileCompleteness);


// Change Password Route
router.patch("/change-password", verifyJWT, isAdmin, changePasswordAdmin);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DASHBOARD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Get session duration
router.get("/session-durations/:userId", verifyJWT, isAdmin, getUserSessionDurations);
router.get("/average-session-duration", getAverageSessionDuration);
// Get all users
router.get("/all-users", getAllUsers);
// Get active users count
router.get("/active-users-count", getActiveUsersCount);

// Get game participation stats
router.get("/game-graph", getGameParticipationStats)

// Get completed targets for a user
router.get('/completedTargets', getCompletedTargets);

//get all completed targets
router.get('/get-all-completed-targets', getAllCompletedTargets);

//get count of total completed targets
router.get('/get-all-completed-targets-count', getAllCompletedTargetsCount);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CONTACT US>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/all-contact-us", getContactUs);




export default router;