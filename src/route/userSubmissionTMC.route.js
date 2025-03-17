import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/create-userSubmissionTMC", verifyJWT, isAdmin,)
router.get("/get-userSubmissionTMC-calculatePoints/:id", verifyJWT,)

export default router;