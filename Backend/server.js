import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js"
import bookRoutes from "./routes/book.routes.js"
import orderRoutes from "./routes/order.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"

dotenv.config();

const app = express();

connectDB();

app.use(express.json())

app.get('/', (req, res) => {
    res.send("API running")
})

app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', orderRoutes)
app.use('/api', analyticsRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})