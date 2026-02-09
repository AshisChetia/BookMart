import Wishlist from "../models/wishlist.model.js";
import Book from "../models/book.model.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate({
                path: 'books',
                select: 'title author price image category stock seller',
                populate: { path: 'seller', select: 'fullname' }
            });

        if (!wishlist) {
            wishlist = { books: [] };
        }

        return res.status(200).json({
            success: true,
            wishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
};

// Add book to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;

        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            // Create new wishlist
            wishlist = await Wishlist.create({
                user: req.user._id,
                books: [bookId]
            });
        } else {
            // Check if book already in wishlist
            if (wishlist.books.includes(bookId)) {
                return res.status(400).json({
                    success: false,
                    message: "Book already in wishlist"
                });
            }
            wishlist.books.push(bookId);
            await wishlist.save();
        }

        // Populate and return
        wishlist = await Wishlist.findById(wishlist._id).populate({
            path: 'books',
            select: 'title author price image category stock seller',
            populate: { path: 'seller', select: 'fullname' }
        });

        return res.status(200).json({
            success: true,
            message: "Added to wishlist",
            wishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to wishlist"
        });
    }
};

// Remove book from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        wishlist.books = wishlist.books.filter(
            book => book.toString() !== bookId
        );
        await wishlist.save();

        const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
            path: 'books',
            select: 'title author price image category stock seller',
            populate: { path: 'seller', select: 'fullname' }
        });

        return res.status(200).json({
            success: true,
            message: "Removed from wishlist",
            wishlist: updatedWishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist"
        });
    }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ user: req.user._id });

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear wishlist"
        });
    }
};

// Check if book is in wishlist
export const isInWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        const inWishlist = wishlist ? wishlist.books.includes(bookId) : false;

        return res.status(200).json({
            success: true,
            inWishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to check wishlist"
        });
    }
};
