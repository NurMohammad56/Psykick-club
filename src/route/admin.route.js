import express from 'express';
import {adminLogin} from "../controller/admin.controller.js"
import {isAdmin} from "../middleware/role.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Login Route
router.post("/login", adminLogin);


export default router;