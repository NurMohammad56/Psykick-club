import express from "express";
import { createAboutUs, getAboutUs, updateAboutUs, deleteAboutUs } from "../controller/aboutUs.controller.js";

const router = express.Router();

// CRUD About us for admin
router.post("/create-aboutUs", createAboutUs);
router.get("/get-aboutUs/:id", getAboutUs);
router.patch("/update-aboutUs/:id", updateAboutUs);

export default router;
