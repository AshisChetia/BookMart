import express from "express";
import { getAllBooks, searchBooks, getBookById, createBook, updateBook, deleteBook, getSellerBooks } from "../controllers/book.controller.js";
import { isAuthenticated, isSeller } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get('/books', getAllBooks);
router.get('/books/search', searchBooks);
router.get('/books/:id', getBookById);

// Protected routes (seller only)
router.post('/books', isAuthenticated, isSeller, createBook);
router.put('/books/:id', isAuthenticated, isSeller, updateBook);
router.delete('/books/:id', isAuthenticated, isSeller, deleteBook);
router.get('/seller/books', isAuthenticated, isSeller, getSellerBooks);

export default router;