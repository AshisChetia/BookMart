import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { wishlistAPI, cartAPI } from '../../services/api';

const Wishlist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    // Fetch wishlist on mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistAPI.getWishlist();
            if (response.data.success) {
                setWishlistItems(response.data.wishlist.books || []);
            }
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        try {
            setActionLoading(bookId);
            const response = await wishlistAPI.removeFromWishlist(bookId);
            if (response.data.success) {
                setWishlistItems(response.data.wishlist.books || []);
            }
        } catch (err) {
            console.error('Failed to remove from wishlist:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMoveToCart = async (bookId) => {
        try {
            setActionLoading(bookId);
            // Add to cart
            await cartAPI.addToCart(bookId, 1);
            // Remove from wishlist
            const response = await wishlistAPI.removeFromWishlist(bookId);
            if (response.data.success) {
                setWishlistItems(response.data.wishlist.books || []);
            }
        } catch (err) {
            console.error('Failed to move to cart:', err);
        } finally {
            setActionLoading(null);
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

    const filteredItems = wishlistItems.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                    <span className="text-text-primary">Wishlist</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary flex items-center gap-3">
                                    <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-400 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </span>
                                    <span>
                                        My <span className="font-black italic text-primary">Wishlist</span>
                                    </span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
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
                            <button onClick={fetchWishlist} className="ml-2 text-primary hover:underline">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Wishlist Items */}
                    {!loading && !error && filteredItems.length > 0 && (
                        <section className="mb-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                                {filteredItems.map((book) => (
                                    <div key={book._id} className="bg-background-alt border border-border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                                        {/* Book Image */}
                                        <Link to={`/buyer/book/${book._id}`} state={{ from: 'wishlist' }} className="block relative aspect-[2/3] overflow-hidden">
                                            <img
                                                src={getBookImage(book)}
                                                alt={book.title}
                                                onError={handleImageError}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* In Stock Badge */}
                                            {book.stock > 0 ? (
                                                <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                    IN STOCK
                                                </span>
                                            ) : (
                                                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                    OUT OF STOCK
                                                </span>
                                            )}
                                        </Link>

                                        {/* Book Info */}
                                        <div className="p-2">
                                            <span className="text-[9px] uppercase tracking-wider text-text-muted">{book.category}</span>
                                            <Link to={`/buyer/book/${book._id}`} state={{ from: 'wishlist' }}>
                                                <h3 className="text-xs font-medium text-text-primary mt-0.5 line-clamp-1 hover:text-primary transition-colors">{book.title}</h3>
                                            </Link>
                                            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">{book.author}</p>

                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <span className="text-sm font-bold text-primary">₹{book.price}</span>
                                                <span className="text-[10px] text-text-muted truncate">
                                                    by {book.seller?.fullname || 'Unknown'}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-1.5 mt-2 pt-2 border-t border-border">
                                                <button
                                                    onClick={() => handleMoveToCart(book._id)}
                                                    disabled={actionLoading === book._id || book.stock <= 0}
                                                    className="flex-1 py-1.5 text-[10px] font-medium bg-primary text-white rounded-md hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                                >
                                                    {actionLoading === book._id ? (
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                            Cart
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(book._id)}
                                                    disabled={actionLoading === book._id}
                                                    className="p-1.5 text-text-secondary hover:text-red-500 border border-border rounded-md hover:border-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                                    title="Remove"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {!loading && !error && wishlistItems.length === 0 && (
                        <section className="mb-8">
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto mb-6 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-text-primary mb-2">Your wishlist is empty</h3>
                                <p className="text-text-secondary mb-6">Start saving books you love!</p>
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

                    {/* No Search Results */}
                    {!loading && !error && wishlistItems.length > 0 && filteredItems.length === 0 && (
                        <section className="mb-8">
                            <div className="text-center py-16">
                                <h3 className="text-xl font-medium text-text-primary mb-2">No matching books</h3>
                                <p className="text-text-secondary">Try a different search term</p>
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

export default Wishlist;
