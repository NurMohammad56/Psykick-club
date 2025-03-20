import express from 'express';
import { createContactUs } from '../controller/contactUs.controller.js';
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

router.post('/contact-us', verifyJWT, createContactUs);

export default router;