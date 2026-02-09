import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// All wishlist routes require authentication
router.get("/", isAuthenticated, getWishlist);
router.post("/add", isAuthenticated, addToWishlist);
router.delete("/remove/:bookId", isAuthenticated, removeFromWishlist);
router.delete("/clear", isAuthenticated, clearWishlist);
router.get("/check/:bookId", isAuthenticated, isInWishlist);

export default router;
