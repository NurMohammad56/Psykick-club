import express from 'express';
import { isAdmin } from '../middleware/role.middleware.js';
import { createARVTarget, getAllARVTargets, getAllQueuedARVTargets, updateBufferTime, updateGameTime, updateResultImage, updateAddToQueue, updateUserSubmission, updateRemoveFromQueue, startNextGame, updateMakeInactive, updateMakeComplete, userInclusionInGame } from '../controller/ARVTarget.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create-ARVTarget", verifyJWT, isAdmin, createARVTarget);
router.get("/get-allARVTargets", verifyJWT, isAdmin, getAllARVTargets)
router.get("/get-allQueuedARVTargets", verifyJWT, isAdmin, getAllQueuedARVTargets)
router.patch("/update-startNextGame", verifyJWT, startNextGame)
router.patch("/update-ARVTarget-userSubmission/:id", verifyJWT, updateUserSubmission)
router.patch("/update-ARVTarget-resultImage/:id", verifyJWT, isAdmin, updateResultImage)
router.patch("/update-ARVTarget-addToQueue/:id", verifyJWT, isAdmin, updateAddToQueue)
router.patch("/update-ARVTarget-removeFromQueue/:id", verifyJWT, isAdmin, updateRemoveFromQueue)
router.patch("/update-ARVTarget-gameTime/:id", verifyJWT, isAdmin, updateGameTime)
router.patch("/update-ARVTarget-bufferTime/:id", verifyJWT, isAdmin, updateBufferTime)
router.patch("/update-ARVTarget-makeInactive/:id", verifyJWT, updateMakeInactive)
router.patch("/update-ARVTarget-makeComplete/:id", verifyJWT, updateMakeComplete)
router.patch("/update-ARVTarget-userInclusionInGame/:id", verifyJWT, userInclusionInGame)

export default router;