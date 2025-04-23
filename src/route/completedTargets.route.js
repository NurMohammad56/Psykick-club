import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';
import { getAllCompletedTargets } from '../controller/completedTargets.controller.js';

const router = express.Router();

router.get('/get-all-completed-targets', verifyJWT, isAdmin, getAllCompletedTargets);

export default router;