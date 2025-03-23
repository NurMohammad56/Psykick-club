import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUserSubmissionTMC, createUserSubmissionARV, getTMCTargetResult, getARVTargetResult, updateARVTargetPoints, updateARVAnalytics, updateTMCAnalytics, getPreviousTMCResults, getPreviousARVResults } from "../controller/userSubmission.controller.js";

const router = express.Router();

router.post("/create-userSubmissionTMC", verifyJWT, createUserSubmissionTMC)
router.post("/create-userSubmissionARV", verifyJWT, createUserSubmissionARV)
router.get("/get-previousTMCResults/:currentTMCTargetId", verifyJWT, getPreviousTMCResults)
router.get("/get-previousARVResults/:currentARVTargetId", verifyJWT, getPreviousARVResults)
router.get("/get-TMCResult/:TMCTargetId", verifyJWT, getTMCTargetResult)
router.get("/get-ARVResult/:ARVTargetId", verifyJWT, getARVTargetResult)
router.patch("/update-ARVPoints/:ARVTargetId", verifyJWT, updateARVTargetPoints)
router.patch("/update-ARVAnalytics", verifyJWT, updateARVAnalytics)
router.patch("/update-TMCAnalytics", verifyJWT, updateTMCAnalytics)

export default router;