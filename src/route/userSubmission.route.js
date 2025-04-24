import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { submitARVGame, submitTMCGame, getTMCTargetResult, getARVTargetResult, updateARVTargetPoints, updateARVAnalytics, updateTMCAnalytics, getPreviousTMCResults, getPreviousARVResults, getARVTMCGraphData, getTotalARVTMCGraphData, getUserParticipationTMC, getUserParticipationARV } from "../controller/userSubmission.controller.js";
import { updateUserTier } from "../controller/tier.controller.js"

const router = express.Router();

router.post('/submit-TMCTarget', verifyJWT, submitTMCGame);
router.post('/submit-ARVTarget', verifyJWT, submitARVGame);

router.get("/get-previousTMCResults/:currentTMCTargetId", verifyJWT, getPreviousTMCResults);
router.get("/get-previousARVResults/:currentARVTargetId", verifyJWT, getPreviousARVResults);

router.get("/get-TMCResult/:TMCTargetId", verifyJWT, getTMCTargetResult);
router.get("/get-ARVResult/:ARVTargetId", verifyJWT, getARVTargetResult);

router.patch("/update-ARVPoints/:ARVTargetId", verifyJWT, updateARVTargetPoints);
router.patch("/update-ARVAnalytics", verifyJWT, updateARVAnalytics);
router.patch("/update-TMCAnalytics", verifyJWT, updateTMCAnalytics);
router.post('/update-tier/:userId', verifyJWT, updateUserTier);

//graph
router.get("/user-graph-data/:userId", verifyJWT, getARVTMCGraphData);
router.get("/total-graph-data", verifyJWT, getTotalARVTMCGraphData);

//check if a user participated in the tmc or arv or not
router.get("/get-user-participation-TMC/:userId/:TMCTargetId", verifyJWT, getUserParticipationTMC)
router.get("/get-user-participation-ARV/:userId/:TMCTargetId", verifyJWT, getUserParticipationARV)

export default router;