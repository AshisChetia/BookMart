import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";

// Get user's cart
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.book',
                select: 'title author price image category stock seller',
                populate: { path: 'seller', select: 'fullname' }
            });

        if (!cart) {
            cart = { items: [] };
        }

        return res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { bookId, quantity = 1 } = req.body;

        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Check stock
        if (book.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create new cart
            cart = await Cart.create({
                user: req.user._id,
                items: [{ book: bookId, quantity }]
            });
        } else {
            // Check if book already in cart
            const existingItem = cart.items.find(
                item => item.book.toString() === bookId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ book: bookId, quantity });
            }
            await cart.save();
        }

        // Populate and return
        cart = await Cart.findById(cart._id).populate({
            path: 'items.book',
            select: 'title author price image category stock seller',
            populate: { path: 'seller', select: 'fullname' }
        });

        return res.status(200).json({
            success: true,
            message: "Added to cart",
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to cart"
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.book.toString() === bookId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not in cart"
            });
        }

        item.quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.book',
            select: 'title author price image category stock seller',
            populate: { path: 'seller', select: 'fullname' }
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart"
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.book.toString() !== bookId
        );
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.book',
            select: 'title author price image category stock seller',
            populate: { path: 'seller', select: 'fullname' }
        });

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: updatedCart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from cart"
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });

        return res.status(200).json({
            success: true,
            message: "Cart cleared"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};
