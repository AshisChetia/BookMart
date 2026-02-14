import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "shipped", "delivered"],
        default: "pending"
    },
    shippingAddress: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

// Indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });

export default Order;