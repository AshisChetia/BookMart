import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { cartAPI, wishlistAPI, orderAPI } from '../../services/api';

const Cart = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.getCart();
            if (response.data.success) {
                setCartItems(response.data.cart.items || []);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        try {
            setActionLoading(bookId);
            const response = await cartAPI.removeFromCart(bookId);
            if (response.data.success) {
                setCartItems(response.data.cart.items || []);
            }
        } catch (err) {
            console.error('Failed to remove from cart:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleQuantityChange = async (bookId, change) => {
        const item = cartItems.find(i => i.book._id === bookId);
        if (!item) return;

        const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
        if (newQuantity === item.quantity) return;

        try {
            setActionLoading(bookId);
            const response = await cartAPI.updateCartItem(bookId, newQuantity);
            if (response.data.success) {
                setCartItems(response.data.cart.items || []);
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMoveToWishlist = async (bookId) => {
        try {
            setActionLoading(bookId);
            // Add to wishlist
            await wishlistAPI.addToWishlist(bookId);
            // Remove from cart
            const response = await cartAPI.removeFromCart(bookId);
            if (response.data.success) {
                setCartItems(response.data.cart.items || []);
            }
        } catch (err) {
            console.error('Failed to move to wishlist:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckout = async () => {
        try {
            setCheckoutLoading(true);
            // Create order for each cart item
            for (const item of cartItems) {
                await orderAPI.createOrder({
                    bookId: item.book._id,
                    quantity: item.quantity,
                    shippingAddress: 'Default Address' // In real app, collect from user
                });
            }
            // Clear cart after checkout
            await cartAPI.clearCart();
            navigate('/buyer/orders');
        } catch (err) {
            console.error('Checkout failed:', err);
            setError('Checkout failed. Please try again.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Helper to get book image or placeholder
    const getBookImage = (book) => {
        if (book?.image && (book.image.startsWith('http://') || book.image.startsWith('https://'))) {
            return book.image;
        }
        return assets.landing.featured;
    };

    const handleImageError = (e) => {
        e.target.src = assets.landing.featured;
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
    const deliveryFee = subtotal > 499 ? 0 : 40;
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <BuyerHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 overflow-y-auto overflow-x-hidden">
                    {/* Page Header */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                                    <Link to="/buyer/home" className="hover:text-primary transition-colors">Home</Link>
                                    <span>/</span>
                                    <span className="text-text-primary">Shopping Cart</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary flex items-center gap-3">
                                    <span className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </span>
                                    <span>
                                        Shopping <span className="font-black italic text-primary">Cart</span>
                                    </span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </section>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-12 text-red-500">
                            {error}
                            <button onClick={fetchCart} className="ml-2 text-primary hover:underline">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Cart Content */}
                    {!loading && !error && cartItems.length > 0 && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items */}
                            <section className="flex-1">
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.book._id} className="bg-background-alt border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col sm:flex-row">
                                                {/* Book Image */}
                                                <Link to={`/buyer/book/${item.book._id}`} state={{ from: 'cart' }} className="block relative w-full sm:w-32 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={getBookImage(item.book)}
                                                        alt={item.book.title}
                                                        onError={handleImageError}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </Link>

                                                {/* Book Info */}
                                                <div className="flex-1 p-4 flex flex-col">
                                                    <div className="flex-1">
                                                        <span className="text-[10px] uppercase tracking-wider text-text-muted">{item.book.category}</span>
                                                        <Link to={`/buyer/book/${item.book._id}`} state={{ from: 'cart' }}>
                                                            <h3 className="text-base font-medium text-text-primary mt-1 hover:text-primary transition-colors">{item.book.title}</h3>
                                                        </Link>
                                                        <p className="text-sm text-text-secondary mt-0.5">{item.book.author}</p>

                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-lg font-bold text-primary">₹{item.book.price}</span>
                                                            <span className="text-xs text-text-muted">
                                                                by {item.book.seller?.fullname || 'Unknown Seller'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Quantity & Actions */}
                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm text-text-secondary">Qty:</span>
                                                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.book._id, -1)}
                                                                    disabled={item.quantity <= 1 || actionLoading === item.book._id}
                                                                    className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                    </svg>
                                                                </button>
                                                                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-text-primary bg-background">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.book._id, 1)}
                                                                    disabled={item.quantity >= 10 || actionLoading === item.book._id}
                                                                    className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleMoveToWishlist(item.book._id)}
                                                                disabled={actionLoading === item.book._id}
                                                                className="p-2 text-text-secondary hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                                                title="Move to Wishlist"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemove(item.book._id)}
                                                                disabled={actionLoading === item.book._id}
                                                                className="p-2 text-text-secondary hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                                                title="Remove"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center gap-4 mt-6">
                                    <Link
                                        to="/buyer/home"
                                        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </section>

                            {/* Order Summary */}
                            <section className="lg:w-80 xl:w-96">
                                <div className="bg-background-alt border border-border rounded-xl p-6 sticky top-4">
                                    <h2 className="text-lg font-medium text-text-primary mb-4">Order Summary</h2>

                                    <div className="space-y-3 pb-4 border-b border-border">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                            <span className="text-text-primary font-medium">₹{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Delivery Fee</span>
                                            {deliveryFee === 0 ? (
                                                <span className="text-green-600 font-medium">FREE</span>
                                            ) : (
                                                <span className="text-text-primary font-medium">₹{deliveryFee}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-4 border-b border-border">
                                        <span className="text-base font-medium text-text-primary">Total</span>
                                        <span className="text-xl font-bold text-primary">₹{total}</span>
                                    </div>

                                    {subtotal < 499 && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-green-700">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Add ₹{499 - subtotal} more for FREE Delivery!
                                            </div>
                                            <div className="mt-2 h-1.5 bg-green-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading || cartItems.length === 0}
                                        className="w-full mt-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {checkoutLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                                Proceed to Checkout
                                            </>
                                        )}
                                    </button>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Secure Payment
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Easy Returns
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                Original Books
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Fast Delivery
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && cartItems.length === 0 && (
                        <section className="mb-8">
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto mb-6 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-text-primary mb-2">Your cart is empty</h3>
                                <p className="text-text-secondary mb-6">Looks like you haven't added anything to your cart yet.</p>
                                <Link
                                    to="/buyer/home"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Explore Books
                                </Link>
                            </div>
                        </section>
                    )}
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-text-muted">© 2026 BookMart. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Help</a>
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Cart;
