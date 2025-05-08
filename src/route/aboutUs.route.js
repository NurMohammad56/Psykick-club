import express from "express";
import { createAboutUs, getAboutUs, updateAboutUs, deleteAboutUs } from "../controller/aboutUs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CRUD About us for admin
router.post("/create-aboutUs", verifyJWT, isAdmin, createAboutUs);
router.get("/get-aboutUs/:id", verifyJWT, getAboutUs);
router.patch("/update-aboutUs/:id", verifyJWT, isAdmin, updateAboutUs);

export default router;
