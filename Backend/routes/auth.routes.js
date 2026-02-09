import express from "express";
import { signup, login, getMe, updateProfile } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', isAuthenticated, getMe);
router.put('/auth/profile', isAuthenticated, updateProfile);

export default router;