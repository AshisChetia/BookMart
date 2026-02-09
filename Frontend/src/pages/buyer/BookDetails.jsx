import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { bookAPI } from '../../services/api';

const BookDetails = () => {
    const { bookId } = useParams();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get source info from navigation state
    const sourceInfo = location.state || { from: 'home' };

    // Fetch book details from API
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await bookAPI.getBookById(bookId);
                setBook(response.data.book);
                setError('');
            } catch (err) {
                console.error('Error fetching book:', err);
                setError('Unable to load book details. Please try again later.');
                setBook(null);
            } finally {
                setLoading(false);
            }
        };
        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    const handleQuantityChange = (delta) => {
        const stock = book?.stock || 10;
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= stock) {
            setQuantity(newQty);
        }
    };

    // Helper to get book image or placeholder
    const getBookImage = (bookData) => {
        if (bookData?.image && (bookData.image.startsWith('http://') || bookData.image.startsWith('https://'))) {
            return bookData.image;
        }
        return assets.landing.featured;
    };

    // Fallback for broken images
    const handleImageError = (e) => {
        e.target.src = assets.landing.featured;
    };

    // Build dynamic breadcrumb based on source
    const renderBreadcrumb = () => {
        const breadcrumbs = [{ label: 'Home', path: '/buyer/home' }];

        if (sourceInfo.from === 'new-arrivals') {
            breadcrumbs.push({ label: 'New Arrivals', path: '/buyer/new' });
        } else if (sourceInfo.from === 'category') {
            breadcrumbs.push({ label: 'Categories', path: '/buyer/categories' });
            if (sourceInfo.categoryName) {
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

        breadcrumbs.push({ label: book?.title || 'Book Details', path: null });

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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
                <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen min-w-0">
                    <BuyerHeader
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onMenuClick={() => setSidebarOpen(true)}
                    />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </main>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !book) {
        return (
            <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
                <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen min-w-0">
                    <BuyerHeader
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onMenuClick={() => setSidebarOpen(true)}
                    />
                    <main className="flex-1 flex flex-col items-center justify-center p-8">
                        <svg className="w-16 h-16 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-xl font-medium text-text-primary mb-2">Book not found</h3>
                        <p className="text-text-secondary mb-4">{error || 'This book may no longer be available.'}</p>
                        <Link to="/buyer/home" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                            Back to Home
                        </Link>
                    </main>
                </div>
            </div>
        );
    }

    const discountPercent = book.originalPrice ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            {/* Sidebar */}
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <BuyerHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Main Content */}
                <main className="flex-1 px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 overflow-y-auto overflow-x-hidden">
                    {/* Breadcrumb */}
                    {renderBreadcrumb()}

                    {/* Book Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left - Book Image */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative max-w-sm w-full">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border">
                                    <img
                                        src={getBookImage(book)}
                                        alt={book.title}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {discountPercent > 0 && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right - Book Info */}
                        <div className="flex flex-col">
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                    {book.category}
                                </span>
                                <span className="text-xs text-text-muted">
                                    Listed {new Date(book.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Title and Author */}
                            <h1 className="text-2xl md:text-3xl font-serif text-text-primary mb-1">
                                {book.title}
                            </h1>
                            {book.subHeading && (
                                <p className="text-text-secondary mb-2">{book.subHeading}</p>
                            )}
                            <p className="text-lg text-text-secondary mb-4">
                                by <span className="text-primary font-medium">{book.author}</span>
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={star <= 4 ? "text-yellow-400" : "text-gray-300"}>★</span>
                                    ))}
                                </div>
                                <span className="text-sm text-text-secondary">4.5 rating</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl font-bold text-text-primary">₹{book.price}</span>
                                {book.originalPrice && book.originalPrice > book.price && (
                                    <span className="text-lg text-text-muted line-through">₹{book.originalPrice}</span>
                                )}
                                {discountPercent > 0 && (
                                    <span className="text-sm font-medium text-green-500">Save {discountPercent}%</span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {book.stock > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-sm text-green-600">In Stock ({book.stock} available)</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        <span className="text-sm text-red-500">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm text-text-secondary">Quantity:</span>
                                <div className="flex items-center border border-border rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 border-x border-border text-text-primary">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                                        disabled={quantity >= (book.stock || 10)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <button className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button className="flex-1 border border-primary text-primary py-3 px-6 rounded-xl font-medium hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Add to Wishlist
                                </button>
                            </div>

                            {/* Seller Info Card */}
                            <div className="p-4 bg-background-alt/50 rounded-xl border border-border">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {book.seller?.fullname?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{book.seller?.fullname || 'Seller'}</p>
                                        <p className="text-xs text-text-secondary">{book.seller?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified Seller
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <section className="mt-12">
                        <div className="flex items-center gap-4 border-b border-border mb-6">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Details
                            </button>
                        </div>

                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none text-text-secondary">
                                <p className="whitespace-pre-line">{book.description}</p>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-background-alt/50 rounded-lg">
                                    <span className="text-text-muted">Category</span>
                                    <p className="text-text-primary font-medium">{book.category}</p>
                                </div>
                                <div className="p-3 bg-background-alt/50 rounded-lg">
                                    <span className="text-text-muted">Stock</span>
                                    <p className="text-text-primary font-medium">{book.stock} copies</p>
                                </div>
                                <div className="p-3 bg-background-alt/50 rounded-lg">
                                    <span className="text-text-muted">Author</span>
                                    <p className="text-text-primary font-medium">{book.author}</p>
                                </div>
                                <div className="p-3 bg-background-alt/50 rounded-lg">
                                    <span className="text-text-muted">Added</span>
                                    <p className="text-text-primary font-medium">{new Date(book.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default BookDetails;
