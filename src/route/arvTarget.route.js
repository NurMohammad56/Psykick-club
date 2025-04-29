import express from 'express';
import { createARVTarget, getAllARVTargets, getAllQueuedARVTargets, getAllUnQueuedARVTargets, getActiveARVTarget, updateBufferTime, updateGameTime, updateResultImage, updateAddToQueue, updateRemoveFromQueue, startNextGame, updateMakeInactive, updateMakeComplete } from '../controller/ARVTarget.controller.js';

const router = express.Router();

//admin
router.post("/create-ARVTarget", createARVTarget);
router.get("/get-allARVTargets", getAllARVTargets)
router.get("/get-allQueuedARVTargets", getAllQueuedARVTargets)
router.get("/get-allUnQueuedARVTargets", getAllUnQueuedARVTargets)
router.get("/get-activeARVTarget", getActiveARVTarget)
router.patch("/update-ARVTarget-resultImage/:id", updateResultImage)
router.patch("/update-ARVTarget-addToQueue/:id", updateAddToQueue)
router.patch("/update-ARVTarget-removeFromQueue/:id", updateRemoveFromQueue)
router.patch("/update-ARVTarget-gameTime/:id", updateGameTime)
router.patch("/update-ARVTarget-bufferTime/:id", updateBufferTime)
router.patch("/update-startNextGame", startNextGame)
router.patch("/update-ARVTarget-makeInactive/:id", updateMakeInactive)
router.patch("/update-ARVTarget-makeComplete/:id", updateMakeComplete)

export default router;