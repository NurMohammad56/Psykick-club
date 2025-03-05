import express from "express";
import { registerUser } from "../controller/user.controller";

const router = express.Router();

// Register User Route
router.post("/register", registerUser);

export default router;
