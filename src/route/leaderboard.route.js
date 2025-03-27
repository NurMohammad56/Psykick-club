import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getARVLeaderboard, getTMCLeaderboard, getTotalLeaderboard } from "../controller/leaderboard.controller.js";

const router = express.Router();

router.get("/get-TMCLeaderboard", verifyJWT, getTMCLeaderboard);
router.get("/get-ARVLeaderboard", verifyJWT, getARVLeaderboard);
router.get("/get-totalLeaderboard", verifyJWT, getTotalLeaderboard);

export default router;
