import express from "express";
import { createAboutUs, getAboutUs, updateAboutUs, deleteAboutUs } from "../controller/aboutUs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CRUD About us for admin
router.post("/create-aboutUs", createAboutUs);
router.get("/get-aboutUs", getAboutUs);
router.patch("/update-aboutUs/:id", updateAboutUs);
router.delete("/delete-aboutUs/:id", deleteAboutUs);

// getting about us from user
router.get("/aboutUs", verifyJWT, getAboutUs);


export default router;
