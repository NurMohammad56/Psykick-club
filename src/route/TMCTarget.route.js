import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from '../middleware/role.middleware.js';
import { createTMCTarget, getAllQueuedTMCTargets, getAllTMCTargets, updateTMCTargetAddToQueue, updateTMCTargetBufferTime, updateTMCTargetGameTime, updateTMCTargetRemoveFromQueue } from "../controller/TMCTarget.controller.js";

const router = express.Router();

router.post("/create-TMCTarget", verifyJWT, isAdmin, createTMCTarget)
// router.get("/get-TMCTarget/:id", verifyJWT, getTMCTarget)
router.get("/get-allTMCTargets", verifyJWT, isAdmin, getAllTMCTargets)
router.get("/get-allQueuedTMCTargets", verifyJWT, isAdmin, getAllQueuedTMCTargets)
router.patch("/update-TMCTarget-addToQueue/:id", verifyJWT, isAdmin, updateTMCTargetAddToQueue)
router.patch("/update-TMCTarget-removeFromQueue/:id", verifyJWT, isAdmin, updateTMCTargetRemoveFromQueue)
router.patch("/update-TMCTarget-bufferTime/:id", verifyJWT, isAdmin, updateTMCTargetBufferTime)
router.patch("/update-TMCTarget-gameTime/:id", verifyJWT, isAdmin, updateTMCTargetGameTime)

export default router;