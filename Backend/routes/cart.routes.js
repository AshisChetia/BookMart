import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cart.controller.js";

const router = express.Router();

// All cart routes require authentication
router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateCartItem);
router.delete("/remove/:bookId", isAuthenticated, removeFromCart);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
