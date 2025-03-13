import express from "express";
import { registerUser, loginUser } from "../controller/user.controller.js";

const router = express.Router();

// Register User Route
router.post("/register", registerUser);
router.post("/login", loginUser);



export default router;
