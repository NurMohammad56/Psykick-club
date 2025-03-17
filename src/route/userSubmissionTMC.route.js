import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from '../middleware/role.middleware.js';
import { get } from "mongoose";

const router = express.Router();

router.post("/create-userSubmissionTMC", verifyJWT, createUserSubmissionTMC);
router.get("/get-userSubmissionTMC-calculatePoints/:id", verifyJWT, getUserSubmissionTMCAndCalculatePoints);

export default router;