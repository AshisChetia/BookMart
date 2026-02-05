import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await user.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(401).json({
                success: false,
                message:"User not found"
            })
        }

        req.user = user;

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export const isSeller = (req, res, next) => {
    if(req.user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Sellers only"
        })
    }
    next();
}