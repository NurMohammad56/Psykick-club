import express from 'express';
import { isAdmin } from '../middleware/role.middleware.js';
import { createARVTarget, getAllARVTargets, getAllQueuedARVTargets, getAllUnQueuedARVTargets, getActiveARVTarget, updateBufferTime, updateGameTime, updateResultImage, updateAddToQueue, updateRemoveFromQueue, startNextGame, updateMakeInactive, updateMakeComplete } from '../controller/ARVTarget.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

//admin
router.post("/create-ARVTarget", verifyJWT, isAdmin, createARVTarget);
router.get("/get-allARVTargets", verifyJWT, isAdmin, getAllARVTargets)
router.get("/get-allQueuedARVTargets", verifyJWT, isAdmin, getAllQueuedARVTargets)
router.get("/get-allUnQueuedARVTargets", verifyJWT, isAdmin, getAllUnQueuedARVTargets)
router.patch("/update-ARVTarget-resultImage/:id", verifyJWT, isAdmin, updateResultImage)
router.patch("/update-ARVTarget-addToQueue/:id", verifyJWT, isAdmin, updateAddToQueue)
router.patch("/update-ARVTarget-removeFromQueue/:id", verifyJWT, isAdmin, updateRemoveFromQueue)
router.patch("/update-ARVTarget-gameTime/:id", verifyJWT, isAdmin, updateGameTime)
router.patch("/update-ARVTarget-bufferTime/:id", verifyJWT, isAdmin, updateBufferTime)

//user or both
router.get("/get-activeARVTarget", verifyJWT, getActiveARVTarget)
router.patch("/update-startNextGame", verifyJWT, startNextGame)
router.patch("/update-ARVTarget-makeInactive/:id", verifyJWT, updateMakeInactive)
router.patch("/update-ARVTarget-makeComplete/:id", verifyJWT, updateMakeComplete)

export default router;