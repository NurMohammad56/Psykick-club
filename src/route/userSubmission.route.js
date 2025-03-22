import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUserSubmissionTMC, createUserSubmissionARV, getTMCTargetResult, getARVTargetResult, updateARVTargetPoints } from "../controller/userSubmission.controller.js";

const router = express.Router();

router.post("/create-userSubmissionTMC", verifyJWT, createUserSubmissionTMC)
router.post("/create-userSubmissionARV", verifyJWT, createUserSubmissionARV)
router.get("/get-TMCResult/:TMCTargetId", verifyJWT, getTMCTargetResult)
router.get("/get-ARVResult/:ARVTargetId", verifyJWT, getARVTargetResult)
router.patch("/update-ARVPoints/:ARVTargetId", verifyJWT, updateARVTargetPoints)

export default router;