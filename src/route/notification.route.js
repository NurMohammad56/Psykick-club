import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getNotifications, createNotification } from "../controller/notification.controller.js";

const router = express.Router();

router.post("/create-notifications/:userId?", verifyJWT, createNotification)
router.get("/get-notifications/:userId", verifyJWT, getNotifications)

export default router;