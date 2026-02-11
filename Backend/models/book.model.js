import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [200, "Title must be at most 200 characters long"]
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        minlength: [3, "Author name must be at least 3 characters long"],
        maxlength: [200, "Author name must be at most 200 characters long"]
    },
    subHeading: {
        type: String,
        required: [true, "Subheading is required"],
        trim: true,
        minlength: [3, "Subheading must be at least 3 characters long"],
        maxlength: [200, "Subheading must be at most 200 characters long"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [5000, "Description must be at most 5000 characters long"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        trim: true
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    images: [{
        type: String
    }],
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    }
}, { timestamps: true })

const Book = mongoose.model("Book", bookSchema);

export default Book;