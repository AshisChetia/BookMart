import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { createOrder, getMyOrder, getSellerOrders, updateOrderStatus, deleteOrder } from "../controllers/order.controller.js";


const router = express.Router();

router.post('/create-order', isAuthenticated, createOrder);
router.get('/orders/my', isAuthenticated, getMyOrder);
router.get('/seller/orders', isAuthenticated, getSellerOrders);
router.put('/update-status/:id', isAuthenticated, updateOrderStatus);
router.delete('/delete-order/:id', isAuthenticated, deleteOrder);

export default router;