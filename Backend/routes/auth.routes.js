import express from "express";
import { signup, login, getMe, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', isAuthenticated, getMe);
router.put('/auth/profile', isAuthenticated, updateProfile);

// Address Management
router.post('/auth/address', isAuthenticated, addAddress);
router.put('/auth/address/:addressId', isAuthenticated, updateAddress);
router.delete('/auth/address/:addressId', isAuthenticated, deleteAddress);
router.put('/auth/address/:addressId/default', isAuthenticated, setDefaultAddress);

export default router;