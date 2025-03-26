import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { submitARVGame, checkARVOutcome, submitTMCGame, getTMCTargetResult, getARVTargetResult, updateARVTargetPoints, updateARVAnalytics, updateTMCAnalytics, getPreviousTMCResults, getPreviousARVResults } from "../controller/userSubmission.controller.js";
import { updateUserTier } from "../controller/tier.controller.js"

const router = express.Router();

router.post('/submit-TMCTarget',verifyJWT, submitTMCGame); 
router.post('/submit-ARVTarget',verifyJWT, submitARVGame); 

router.get("/get-previousTMCResults/:currentTMCTargetId", verifyJWT, getPreviousTMCResults);
router.get("/get-previousARVResults/:currentARVTargetId", verifyJWT, getPreviousARVResults);

router.get("/get-TMCResult/:TMCTargetId", verifyJWT, getTMCTargetResult);
router.get("/get-ARVResult/:ARVTargetId", verifyJWT, getARVTargetResult);

router.patch("/update-ARVPoints/:ARVTargetId", verifyJWT, updateARVTargetPoints);
router.patch("/update-ARVAnalytics", verifyJWT, updateARVAnalytics);
router.patch("/update-TMCAnalytics", verifyJWT, updateTMCAnalytics);
router.post('/update-tier/:userId',verifyJWT, updateUserTier);
router.post('/check-outcome', checkARVOutcome);


export default router;