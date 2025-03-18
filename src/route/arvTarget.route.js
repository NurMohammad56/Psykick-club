import express from 'express';
import { isAdmin } from '../middleware/role.middleware.js';
import { createARVTarget, getAllARVTargets, getAllQueuedARVTargets, updateBufferTime, updateGameTime, updateResultImage, updateARVTargetAddToQueue, updateUserSubmission, updateARVTargetRemoveFromQueue } from '../controller/ARVTarget.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create-ARVTarget", verifyJWT, isAdmin, createARVTarget);
// router.get("/get-ARVTarget/:id", verifyJWT, getARVTarget)
router.get("/get-allARVTargets", verifyJWT, isAdmin, getAllARVTargets)
router.get("/get-allQueuedARVTargets", verifyJWT, isAdmin, getAllQueuedARVTargets)
router.patch("/update-ARVTarget-userSubmission/:id", verifyJWT, updateUserSubmission)
router.patch("/update-ARVTarget-resultImage/:id", verifyJWT, isAdmin, updateResultImage)
router.patch("/update-ARVTarget-addToQueue/:id", verifyJWT, isAdmin, updateARVTargetAddToQueue)
router.patch("/update-ARVTarget-removeFromQueue/:id", verifyJWT, isAdmin, updateARVTargetRemoveFromQueue)
router.patch("/update-ARVTarget-gameTime/:id", verifyJWT, isAdmin, updateGameTime)
router.patch("/update-ARVTarget-bufferTime/:id", verifyJWT, isAdmin, updateBufferTime)

export default router;