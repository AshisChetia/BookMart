import Book from "../models/book.model.js";


export const createBook = async (req, res) => {
    try {

        const { title, author, subHeading, description, price, stock, image, category, images } = req.body;

        const seller = req.user._id;

        // If 'images' array is provided, use the first one as primary 'image' if not explicitly provided
        let primaryImage = image;
        if (!primaryImage && images && images.length > 0) {
            primaryImage = images[0];
        }

        if (!title || !author || !subHeading || !description || !price || !stock || !primaryImage || !category || !seller) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const book = await Book.create({
            title,
            author,
            subHeading,
            description,
            price,
            stock,
            image: primaryImage,
            images: images || [primaryImage],
            category,
            seller
        })

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            book
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during book creation"
        })
    }
}



export const updateBook = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, author, subHeading, description, price, stock, image, category } = req.body;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Book not found"
            })
        }

        if (book.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this book"
            })
        }

        const updateBook = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            updateBook
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during book update"
        })
    }
}

export const deleteBook = async (req, res) => {
    try {

        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        if (book.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this book"
            })
        }

        await Book.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during book deletion"
        })
    }
}

export const getAllBooks = async (req, res) => {
    try {

        const books = await Book.find().populate("seller", "fullname email")

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Books not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Book fetch successfully",
            books
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during book fetch"
        })
    }
}



export const getBookById = async (req, res) => {
    try {

        const { id } = req.params

        const book = await Book.findById(id).populate("seller", "fullname email")

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Book fetch successfully",
            book

        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during book fetch"
        })
    }
}


export const getSellerBooks = async (req, res) => {
    try {

        const seller = req.user._id;

        const books = await Book.find({ seller }).populate("seller", "fullname email");

        return res.status(200).json({
            success: true,
            message: "Books fetch successfully",
            books
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            messaage: "Server error during book fetch"
        })
    }
}


export const searchBooks = async (req, res) => {
    try {
        const {
            query,
            category,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;

        let filter = {};

        if (query) {
            const regex = new RegExp(query, "i");
            filter.$or = [
                { title: regex },
                { author: regex }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const books = await Book.find(filter)
            .populate("seller", "fullname email")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Book.countDocuments(filter);
        return res.status(200).json({
            success: true,
            count: books.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            books
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during search"
        });
    }
};