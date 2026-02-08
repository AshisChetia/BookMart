import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const Wishlist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Dummy wishlist data - in real app would come from API/state
    const [wishlistItems, setWishlistItems] = useState([
        { id: 1, title: "The Psychology of Money", author: "Morgan Housel", price: 299, originalPrice: 450, image: assets.landing.featured, category: "Non-Fiction", rating: 4.8, inStock: true },
        { id: 2, title: "Atomic Habits", author: "James Clear", price: 349, originalPrice: 499, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.9, inStock: true },
        { id: 3, title: "The Silent Patient", author: "Alex Michaelides", price: 275, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, inStock: true },
        { id: 4, title: "Dune", author: "Frank Herbert", price: 399, originalPrice: 550, image: assets.categories.thriller, category: "Science Fiction", rating: 4.8, inStock: false },
        { id: 5, title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, originalPrice: 450, image: assets.categories.fiction, category: "Fiction", rating: 4.7, inStock: true },
    ]);

    const handleRemove = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleMoveToCart = (id) => {
        // In real app, add to cart and remove from wishlist
        console.log('Moving to cart:', id);
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const filteredItems = wishlistItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background font-sans flex">
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen">
                <BuyerHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">
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

                    {/* Wishlist Items */}
                    {filteredItems.length > 0 ? (
                        <section className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredItems.map((item) => (
                                    <div key={item.id} className="bg-background-alt border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
                                        {/* Book Image */}
                                        <Link to={`/buyer/book/${item.id}`} state={{ from: 'wishlist' }} className="block relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Rating badge */}
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium flex items-center gap-1">
                                                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {item.rating}
                                            </div>

                                            {/* Discount badge */}
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">
                                                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                            </div>

                                            {/* Out of stock overlay */}
                                            {!item.inStock && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Out of Stock</span>
                                                </div>
                                            )}

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 cursor-pointer z-10"
                                                title="Remove from wishlist"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </Link>

                                        {/* Book Info */}
                                        <div className="p-4">
                                            <span className="text-[10px] uppercase tracking-wider text-text-muted">{item.category}</span>
                                            <Link to={`/buyer/book/${item.id}`} state={{ from: 'wishlist' }}>
                                                <h3 className="text-sm font-medium text-text-primary mt-1 line-clamp-1 hover:text-primary transition-colors">{item.title}</h3>
                                            </Link>
                                            <p className="text-xs text-text-secondary mt-0.5">{item.author}</p>

                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-lg font-bold text-primary">₹{item.price}</span>
                                                <span className="text-sm text-text-muted line-through">₹{item.originalPrice}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleMoveToCart(item.id)}
                                                    disabled={!item.inStock}
                                                    className="flex-1 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
                                                    title="Remove"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        /* Empty State */
                        <section className="mb-8">
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto mb-6 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-text-primary mb-2">Your wishlist is empty</h3>
                                <p className="text-text-secondary mb-6">Save items you love to your wishlist and buy them later.</p>
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

                    {/* Recommendations */}
                    {wishlistItems.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-lg font-medium text-text-primary mb-4">You might also like</h2>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                <Link to="/buyer/categories/fiction" className="px-4 py-2 bg-background-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                                    Fiction
                                </Link>
                                <Link to="/buyer/categories/self-help" className="px-4 py-2 bg-background-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                                    Self-Help
                                </Link>
                                <Link to="/buyer/categories/thriller" className="px-4 py-2 bg-background-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                                    Thriller
                                </Link>
                                <Link to="/buyer/new" className="px-4 py-2 bg-background-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                                    New Arrivals
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

export default Wishlist;
