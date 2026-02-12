import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js"
import bookRoutes from "./routes/book.routes.js"
import orderRoutes from "./routes/order.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import uploadRoutes from "./routes/upload.routes.js"

dotenv.config();

const app = express();

connectDB();

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""); // Remove trailing slash
console.log("Allowed CORS Origin:", frontendUrl);

app.use(cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())

app.get('/', (req, res) => {
    res.send("API running")
})

app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', orderRoutes)
app.use('/api', analyticsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/upload', uploadRoutes)

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app;