import express from 'express';
import { isAdmin } from '../middleware/role.middleware.js';
import { addToQueue, createARVTarget, getAllARVTargets, getAllQueuedARVTargets, getARVTarget, updateResultImage, updateUserSubmission } from '../controller/arvTarget.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create-ARVTarget", verifyJWT, isAdmin, createARVTarget);
router.get("/get-ARVTarget/:id", verifyJWT, getARVTarget)
router.get("/get-allARVTargets", verifyJWT, isAdmin, getAllARVTargets)
router.get("/get-allQueuedARVTargets", verifyJWT, isAdmin, getAllQueuedARVTargets)
router.patch("/update-ARVTarget-userSubmission/:id", verifyJWT, updateUserSubmission)
router.patch("/update-ARVTarget-resultImage/:id", verifyJWT, isAdmin, updateResultImage)
router.patch("/update-ARVTarget-addToQueue/:id", verifyJWT, isAdmin, addToQueue)

export default router;