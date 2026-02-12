import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { bookAPI } from '../../services/api';

const NewArrivals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch books from API - sorted by newest
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await bookAPI.getAllBooks();
                // Sort by createdAt descending for new arrivals
                const allBooks = response.data.books || [];
                const sortedBooks = allBooks.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setBooks(sortedBooks);
                setError('');
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Unable to load books. Please try again later.');
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Filter by search
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort books
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
            default: return 0;
        }
    });

    // Helper to get book image or placeholder
    const getBookImage = (book) => {
        if (book.image && (book.image.startsWith('http://') || book.image.startsWith('https://'))) {
            return book.image;
        }
        return assets.landing.featured;
    };

    // Fallback for broken images
    const handleImageError = (e) => {
        e.target.src = assets.landing.featured;
    };

    // Helper to check if book is new (within last 7 days)
    const isNewBook = (createdAt) => {
        const bookDate = new Date(createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - bookDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

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
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                        <Link to="/buyer/home" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-text-primary">New Arrivals</span>
                    </div>

                    {/* Page Header */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Fresh Picks</span>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                                    <span className="font-black italic text-primary">New Arrivals</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-2">
                                    The latest books added to our collection
                                </p>
                            </div>
                            <p className="text-sm text-text-secondary">
                                {sortedBooks.length} books
                            </p>
                        </div>
                    </section>

                    {/* Filters Bar */}
                    <section className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-background-alt/50 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-text-secondary">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </section>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && sortedBooks.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="text-xl font-medium text-text-primary mb-2">No new books yet</h3>
                            <p className="text-text-secondary mb-4">Check back later for new listings!</p>
                            <Link to="/buyer/home" className="text-primary hover:underline">
                                Browse All Books
                            </Link>
                        </div>
                    )}

                    {/* Books Grid */}
                    {!loading && !error && sortedBooks.length > 0 && (
                        <section>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                {sortedBooks.map((book) => (
                                    <Link
                                        key={book._id}
                                        to={`/buyer/book/${book._id}`}
                                        state={{ from: 'new-arrivals' }}
                                        className="group bg-background border border-border hover:border-primary/30 rounded-xl overflow-hidden transition-all hover:shadow-lg relative"
                                    >
                                        {/* New Badge */}
                                        {isNewBook(book.createdAt) && (
                                            <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                NEW
                                            </span>
                                        )}
                                        <div className="aspect-[3/4] overflow-hidden">
                                            <img
                                                src={getBookImage(book)}
                                                alt={book.title}
                                                onError={handleImageError}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-text-primary text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{book.author}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold text-text-primary">₹{book.price}</span>

                                            </div>
                                            <p className="text-[10px] text-text-muted mt-1 line-clamp-1">
                                                by {book.seller?.fullname || 'Unknown Seller'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default NewArrivals;
