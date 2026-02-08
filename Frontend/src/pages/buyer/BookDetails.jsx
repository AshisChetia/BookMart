import { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const BookDetails = () => {
    const { bookId } = useParams();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Get source info from navigation state
    const sourceInfo = location.state || { from: 'home' };

    // Dummy book data - replace with API call using bookId
    const book = {
        id: bookId,
        title: "The Psychology of Money",
        subHeading: "Timeless lessons on wealth, greed, and happiness",
        author: "Morgan Housel",
        description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in the real world people don't make financial decisions on a spreadsheet. They make them at the dinner table, or in a meeting room, where personal history, your own unique view of the world, ego, pride, marketing, and odd incentives are scrambled together.\n\nIn The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
        price: 299,
        originalPrice: 450,
        image: assets.landing.featured,
        category: "Non-Fiction",
        stock: 15,
        rating: 4.8,
        reviewCount: 124,
        seller: {
            id: 'seller-123',
            name: 'BookWorm Store',
            avatar: 'BW',
            rating: 4.9,
            totalSales: 1250,
            responseTime: '< 2 hours',
            memberSince: '2023',
            location: 'Mumbai, Maharashtra',
            verified: true
        },
        createdAt: '2026-01-15'
    };

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= book.stock) {
            setQuantity(newQty);
        }
    };

    const discountPercent = Math.round((1 - book.price / book.originalPrice) * 100);

    // Build dynamic breadcrumb based on source
    const renderBreadcrumb = () => {
        const breadcrumbs = [{ label: 'Home', path: '/buyer/home' }];

        if (sourceInfo.from === 'new-arrivals') {
            breadcrumbs.push({ label: 'New Arrivals', path: '/buyer/new' });
        } else if (sourceInfo.from === 'category') {
            breadcrumbs.push({ label: 'Categories', path: '/buyer/categories' });
            if (sourceInfo.categoryName) {
                // Convert spaces to hyphens to match URL format
                const categorySlug = sourceInfo.categoryName.toLowerCase().replace(/\s+/g, '-');
                breadcrumbs.push({
                    label: sourceInfo.categoryName,
                    path: `/buyer/categories/${categorySlug}`
                });
            }
        } else if (sourceInfo.from === 'suggested') {
            breadcrumbs.push({ label: 'Suggested for You', path: null });
        } else if (sourceInfo.from === 'bestsellers') {
            breadcrumbs.push({ label: 'Bestsellers', path: null });
        } else if (sourceInfo.from === 'wishlist') {
            breadcrumbs.push({ label: 'Wishlist', path: '/buyer/wishlist' });
        }

        breadcrumbs.push({ label: book.title, path: null });

        return (
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6 flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {index > 0 && <span>/</span>}
                        {crumb.path ? (
                            <Link to={crumb.path} className="hover:text-primary transition-colors">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className={index === breadcrumbs.length - 1 ? "text-text-primary line-clamp-1" : ""}>
                                {crumb.label}
                            </span>
                        )}
                    </span>
                ))}
            </div>
        );
    };

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
                    {renderBreadcrumb()}

                    {/* === BOOK DETAILS SECTION === */}
                    <section className="mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left - Book Image */}
                            <div className="relative">
                                <div className="sticky top-6">
                                    <div className="aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-background-alt shadow-lg">
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                                        {discountPercent}% OFF
                                    </div>
                                </div>
                            </div>

                            {/* Right - Book Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                        {book.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-medium text-text-primary">{book.rating}</span>
                                        <span className="text-xs text-text-muted">({book.reviewCount} reviews)</span>
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{book.title}</h1>
                                    <p className="text-base text-text-secondary italic mb-2">{book.subHeading}</p>
                                    <p className="text-sm text-text-secondary">by <span className="text-primary font-medium">{book.author}</span></p>
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-primary">₹{book.price}</span>
                                    <span className="text-lg text-text-muted line-through">₹{book.originalPrice}</span>
                                    <span className="text-sm font-medium text-green-600">Save ₹{book.originalPrice - book.price}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {book.stock > 0 ? (
                                        <>
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="text-sm text-green-600 font-medium">In Stock</span>
                                            <span className="text-xs text-text-muted">({book.stock} available)</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-text-secondary">Quantity:</span>
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-background-alt transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="w-12 text-center font-medium text-text-primary">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= book.stock}
                                            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-background-alt transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="flex-1 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Add to Cart
                                    </button>
                                    <button className="flex-1 py-3.5 border border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                        Buy Now
                                    </button>
                                    <button className="w-12 h-12 flex-shrink-0 border border-border rounded-xl flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Seller Card */}
                                <div className="bg-background-alt border border-border rounded-xl p-5">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                            {book.seller.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-text-primary">{book.seller.name}</h3>
                                                {book.seller.verified && (
                                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-medium text-text-primary">{book.seller.rating}</span>
                                                <span className="text-text-muted">• {book.seller.totalSales} sales</span>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                            Visit Store
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="p-2 bg-background rounded-lg">
                                            <p className="text-xs text-text-muted">Response</p>
                                            <p className="text-sm font-medium text-text-primary">{book.seller.responseTime}</p>
                                        </div>
                                        <div className="p-2 bg-background rounded-lg">
                                            <p className="text-xs text-text-muted">Location</p>
                                            <p className="text-sm font-medium text-text-primary truncate">{book.seller.location}</p>
                                        </div>
                                        <div className="p-2 bg-background rounded-lg">
                                            <p className="text-xs text-text-muted">Member Since</p>
                                            <p className="text-sm font-medium text-text-primary">{book.seller.memberSince}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* === DESCRIPTION TABS === */}
                    <section className="mb-10">
                        <div className="border-b border-border mb-6">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'description' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'details' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Details
                                </button>
                            </div>
                        </div>

                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-text-secondary leading-relaxed whitespace-pre-line">{book.description}</p>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="text-text-muted">Title</span>
                                    <span className="text-text-primary font-medium">{book.title}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="text-text-muted">Author</span>
                                    <span className="text-text-primary font-medium">{book.author}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="text-text-muted">Category</span>
                                    <span className="text-text-primary font-medium">{book.category}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="text-text-muted">Stock</span>
                                    <span className="text-text-primary font-medium">{book.stock} units</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="text-text-muted">Listed On</span>
                                    <span className="text-text-primary font-medium">{new Date(book.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        )}
                    </section>
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

export default BookDetails;
