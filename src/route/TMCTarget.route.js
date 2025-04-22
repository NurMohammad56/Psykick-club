import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from '../middleware/role.middleware.js';
import { createTMCTarget, getAllQueuedTMCTargets, getAllTMCTargets, updateAddToQueue, updateBufferTime, updateGameTime, updateRemoveFromQueue, updateMakeInactive, updateMakeComplete, startNextGame, getActiveTMCTarget } from "../controller/TMCTarget.controller.js";

const router = express.Router();

//admin
router.post("/create-TMCTarget", verifyJWT, isAdmin, createTMCTarget)
router.get("/get-allTMCTargets", verifyJWT, isAdmin, getAllTMCTargets)
router.get("/get-allQueuedTMCTargets", verifyJWT, isAdmin, getAllQueuedTMCTargets)
router.patch("/update-TMCTarget-addToQueue/:id", verifyJWT, isAdmin, updateAddToQueue)
router.patch("/update-TMCTarget-removeFromQueue/:id", verifyJWT, isAdmin, updateRemoveFromQueue)
router.patch("/update-TMCTarget-bufferTime/:id", verifyJWT, isAdmin, updateBufferTime)
router.patch("/update-TMCTarget-gameTime/:id", verifyJWT, isAdmin, updateGameTime)

//user or both
router.get("/get-activeTMCTarget", verifyJWT, getActiveTMCTarget)
router.patch("/update-startNextGame", verifyJWT, startNextGame)
router.patch("/update-TMCTarget-makeInactive/:id", verifyJWT, updateMakeInactive)
router.patch("/update-TMCTarget-makeComplete/:id", verifyJWT, updateMakeComplete)

export default router;