import express from "express";
import { isAuthenticated, isSeller } from "../middlewares/auth.middleware.js";
import {
    getSellerDashboard,
    getTopSellingBooks,
    getSuggestedBooks,
    getRecentOrders
} from "../controllers/analytics.controller.js";

const router = express.Router();

// All routes require authentication AND seller role
router.get('/seller/dashboard', isAuthenticated, isSeller, getSellerDashboard);
router.get('/seller/top-books', isAuthenticated, isSeller, getTopSellingBooks);
router.get('/seller/suggestions', isAuthenticated, isSeller, getSuggestedBooks);
router.get('/seller/recent-orders', isAuthenticated, isSeller, getRecentOrders);

export default router;
