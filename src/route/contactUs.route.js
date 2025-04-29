import express from 'express';
import { createContactUs } from '../controller/contactUs.controller.js';

const router = express.Router();

router.post('/contact-us', createContactUs);

export default router;