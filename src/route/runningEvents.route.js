import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getRunningEventsCount } from "../controller/runningEvents.controller.js";

const router = express.Router();

router.get("/get-runningEvents-count", verifyJWT, getRunningEventsCount)

export default router