import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bookmart_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout
            localStorage.removeItem('bookmart_token');
            localStorage.removeItem('bookmart_user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// ============ AUTH APIs ============
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// ============ BOOK APIs ============
export const bookAPI = {
    // Public
    getAllBooks: (params) => api.get('/books', { params }),
    searchBooks: (query) => api.get('/books/search', { params: { q: query } }),
    getBookById: (id) => api.get(`/books/${id}`),

    // Seller only
    getSellerBooks: () => api.get('/seller/books'),
    createBook: (data) => api.post('/books', data),
    updateBook: (id, data) => api.put(`/books/${id}`, data),
    deleteBook: (id) => api.delete(`/books/${id}`),
};

// ============ ORDER APIs ============
export const orderAPI = {
    // Buyer
    createOrder: (data) => api.post('/create-order', data),
    getMyOrders: () => api.get('/orders/my'),

    // Seller
    getSellerOrders: () => api.get('/seller/orders'),
    updateOrderStatus: (id, status) => api.put(`/update-status/${id}`, { status }),
    deleteOrder: (id) => api.delete(`/delete-order/${id}`),
};

// ============ ANALYTICS APIs ============
export const analyticsAPI = {
    getSellerAnalytics: () => api.get('/seller/analytics'),
    getCategoryStats: () => api.get('/categories/stats'),
};

// ============ CART APIs ============
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (bookId, quantity = 1) => api.post('/cart/add', { bookId, quantity }),
    updateCartItem: (bookId, quantity) => api.put('/cart/update', { bookId, quantity }),
    removeFromCart: (bookId) => api.delete(`/cart/remove/${bookId}`),
    clearCart: () => api.delete('/cart/clear'),
};

// ============ WISHLIST APIs ============
export const wishlistAPI = {
    getWishlist: () => api.get('/wishlist'),
    addToWishlist: (bookId) => api.post('/wishlist/add', { bookId }),
    removeFromWishlist: (bookId) => api.delete(`/wishlist/remove/${bookId}`),
    clearWishlist: () => api.delete('/wishlist/clear'),
    isInWishlist: (bookId) => api.get(`/wishlist/check/${bookId}`),
};

export default api;
