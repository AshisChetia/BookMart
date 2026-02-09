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

dotenv.config();

const app = express();

connectDB();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})