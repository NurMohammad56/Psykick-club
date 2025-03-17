import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUserSubmissionTMC, getUserSubmissionTMCAndCalculatePoints } from "../controller/userSubmissionTMC.controller.js";

const router = express.Router();

router.post("/create-userSubmissionTMC", verifyJWT, createUserSubmissionTMC);
router.get("/get-userSubmissionTMC-calculatePoints/:id", verifyJWT, getUserSubmissionTMCAndCalculatePoints);

export default router;