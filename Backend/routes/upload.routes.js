import express from "express";
import { upload } from "../middleware/multer.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, upload.single("image"), uploadImage);

export default router;
