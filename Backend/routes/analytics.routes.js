import express from "express";
import { isAuthenticated, isSeller } from "../middlewares/auth.middleware.js";
import {
    getSellerDashboard,
    getTopSellingBooks,
    getSuggestedBooks,
    getRecentOrders,
    getCategoryStats,
    getSmartSuggestions
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Public routes
router.get('/categories/stats', getCategoryStats);

// Protected routes (Authenticated Users)
router.get('/suggestions', isAuthenticated, getSmartSuggestions);

// Protected routes (Seller only)
router.get('/seller/dashboard', isAuthenticated, isSeller, getSellerDashboard);
router.get('/seller/top-books', isAuthenticated, isSeller, getTopSellingBooks);
router.get('/seller/suggestions', isAuthenticated, isSeller, getSuggestedBooks);
router.get('/seller/recent-orders', isAuthenticated, isSeller, getRecentOrders);

export default router;
