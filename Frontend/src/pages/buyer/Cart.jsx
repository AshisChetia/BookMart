import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { cartAPI, wishlistAPI, orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressPicker, setShowAddressPicker] = useState(false);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (user?.addresses?.length > 0 && !selectedAddress) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [user, selectedAddress]);

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
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }

        try {
            setCheckoutLoading(true);
            const fullAddressString = `${selectedAddress.addressLine}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}. Ph: ${selectedAddress.phone}`;

            // Create order for each cart item
            for (const item of cartItems) {
                await orderAPI.createOrder({
                    seller: item.book.seller,
                    book: item.book._id,
                    quantity: item.quantity,
                    totalAmount: item.book.price * item.quantity,
                    shippingAddress: fullAddressString
                });
            }
            // Clear cart after checkout
            await cartAPI.clearCart();
            toast.success('Orders placed successfully!');
            navigate('/buyer/orders');
        } catch (err) {
            console.error('Checkout failed:', err);
            toast.error('Checkout failed. Please try again.');
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

                <main className="flex-1 px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 overflow-y-auto">
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

                    {!loading && !error && cartItems.length > 0 && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <section className="flex-1">
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.book._id} className="bg-background-alt border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col sm:flex-row">
                                                <Link to={`/buyer/book/${item.book._id}`} state={{ from: 'cart' }} className="block relative w-full sm:w-32 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                                                    <img src={getBookImage(item.book)} alt={item.book.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </Link>
                                                <div className="flex-1 p-4 flex flex-col">
                                                    <div className="flex-1">
                                                        <span className="text-[10px] uppercase tracking-wider text-text-muted">{item.book.category}</span>
                                                        <Link to={`/buyer/book/${item.book._id}`} state={{ from: 'cart' }}>
                                                            <h3 className="text-base font-medium text-text-primary mt-1 hover:text-primary transition-colors">{item.book.title}</h3>
                                                        </Link>
                                                        <p className="text-sm text-text-secondary mt-0.5">{item.book.author}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-lg font-bold text-primary">₹{item.book.price}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                                <button onClick={() => handleQuantityChange(item.book._id, -1)} disabled={item.quantity <= 1 || actionLoading === item.book._id} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-background transition-colors disabled:opacity-50 cursor-pointer">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                                                </button>
                                                                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-text-primary bg-background">{item.quantity}</span>
                                                                <button onClick={() => handleQuantityChange(item.book._id, 1)} disabled={item.quantity >= 10 || actionLoading === item.book._id} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-background transition-colors disabled:opacity-50 cursor-pointer">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleMoveToWishlist(item.book._id)} disabled={actionLoading === item.book._id} className="p-2 text-text-secondary hover:text-red-500 transition-colors cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                                                            <button onClick={() => handleRemove(item.book._id)} disabled={actionLoading === item.book._id} className="p-2 text-text-secondary hover:text-red-500 transition-colors cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="lg:w-80 xl:w-96">
                                <div className="space-y-6 sticky top-4">
                                    {/* Shipping Address Section */}
                                    <div className="bg-background-alt border border-border rounded-xl p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">Shipping Address</h2>
                                            <button
                                                onClick={() => setShowAddressPicker(true)}
                                                className="text-xs text-primary font-bold hover:underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                        {selectedAddress ? (
                                            <div className="bg-background p-3 rounded-lg border border-border/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-text-primary">{selectedAddress.label}</span>
                                                    {selectedAddress.isDefault && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Default</span>}
                                                </div>
                                                <p className="text-xs text-text-secondary leading-tight italic line-clamp-2">
                                                    {selectedAddress.addressLine}, {selectedAddress.city}
                                                </p>
                                                <p className="text-[10px] text-text-muted mt-2 font-mono">{selectedAddress.phone}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-background-alt border border-dashed border-border p-4 rounded-lg text-center">
                                                <p className="text-xs text-text-muted mb-2">No address selected</p>
                                                <Link to="/buyer/profile" className="text-xs text-primary font-bold hover:underline">Add one in Profile</Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-background-alt border border-border rounded-xl p-6">
                                        <h2 className="text-sm font-black uppercase tracking-widest text-text-primary mb-4">Order Summary</h2>
                                        <div className="space-y-3 pb-4 border-b border-border">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Subtotal</span>
                                                <span className="text-text-primary font-medium">₹{subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Delivery Fee</span>
                                                {deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span className="text-text-primary font-medium">₹{deliveryFee}</span>}
                                            </div>
                                        </div>
                                        <div className="flex justify-between py-4 border-b border-border">
                                            <span className="text-base font-medium text-text-primary">Total</span>
                                            <span className="text-xl font-bold text-primary">₹{total}</span>
                                        </div>

                                        <button
                                            onClick={handleCheckout}
                                            disabled={checkoutLoading || cartItems.length === 0 || !selectedAddress}
                                            className="w-full mt-6 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-xl transition-all shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {checkoutLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && cartItems.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-light text-text-primary mb-2">Empty <span className="font-black italic text-primary">Cart</span></h3>
                            <p className="text-text-secondary text-sm mb-8">Looks like you haven't added anything yet.</p>
                            <Link to="/buyer/home" className="inline-block px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full hover:shadow-lg transition-all">Start Shopping</Link>
                        </div>
                    )}
                </main>
            </div>

            {/* Address Picker Modal */}
            {showAddressPicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-background border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden scale-in">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-light italic">Select <span className="font-black text-primary">Address</span></h3>
                            <button onClick={() => setShowAddressPicker(false)} className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                            {user?.addresses?.length > 0 ? (
                                user.addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false); }}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-text-primary">{addr.label}</span>
                                            {addr.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Default</span>}
                                        </div>
                                        <p className="text-xs text-text-secondary line-clamp-1 italic">{addr.addressLine}, {addr.city}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-text-muted mb-4">No saved addresses found.</p>
                                    <Link to="/buyer/profile" className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">Add Address</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
