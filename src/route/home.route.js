import express from "express";
import { getHomeCounts } from "../controller/home.controller.js";

const router = express.Router();

// Home page counts
router.get("/counts", getHomeCounts);

export default router;
