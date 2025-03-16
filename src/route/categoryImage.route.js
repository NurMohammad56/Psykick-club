import express from "express"
import {createCategory} from "../controller/category.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {isAdmin} from "../middleware/role.middleware.js"

const router = express.Router();

// Create Category Route

router.post("/create", verifyJWT, isAdmin, createCategory);

export default router