import express from 'express';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/create-arvTarget", verifyJWT, isAdmin, createARVTarget);
router.get("/get-arvTarget/:id", verifyJWT, getARVTarget)
router.patch("/update-arvTarget-userSubmission/:id", verifyJWT, updateUserSubmission)
router.patch("/update-arvTarget-resultImage/:id", verifyJWT, updateResultImage)

export default router;