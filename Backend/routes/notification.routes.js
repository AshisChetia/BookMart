import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
    getUserNotifications,
    markNotificationRead,
    markAllRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/', isAuthenticated, getUserNotifications);
router.put('/:id/read', isAuthenticated, markNotificationRead);
router.put('/read-all', isAuthenticated, markAllRead);

export default router;
