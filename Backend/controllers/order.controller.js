import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
    try {
        const { seller, book, quantity, totalAmount, shippingAddress } = req.body;

        const buyer = req.user._id;

        const order = await Order.create({
            buyer,
            seller,
            book,
            quantity,
            totalAmount,
            shippingAddress
        })

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create order"
        })
    }
}


export const getMyOrder = async (req, res) => {
    try {

        const orders = await Order.find({ buyer: req.user._id })

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        })
    }
}


export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetch successfully",
            orders
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // Only seller can update order status
        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this order"
            })
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status"
        })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this order"
            })
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be deleted"
            })
        }

        await Order.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete order"
        })
    }
}