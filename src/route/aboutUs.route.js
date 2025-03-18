import express from "express";
import { createAboutUs, getAboutUs } from "../controller/aboutUs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CRUD About us
router.post("/create-aboutUs", verifyJWT, isAdmin, createAboutUs);
router.get("/get-aboutUs", verifyJWT, isAdmin, getAboutUs);


export default router;
