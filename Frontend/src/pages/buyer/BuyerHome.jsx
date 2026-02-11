import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { bookAPI, analyticsAPI } from '../../services/api';

const BuyerHome = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [recReason, setRecReason] = useState('Suggested for You');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Self-Help', 'Thriller', 'Academic'];

    // Sync search query with URL params
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Fetch books from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Parallel fetch for books and suggestions
                const [booksRes, recsRes] = await Promise.all([
                    bookAPI.getAllBooks(),
                    analyticsAPI.getSmartSuggestions()
                ]);

                setBooks(booksRes.data.books || []);

                if (recsRes.data.success) {
                    setRecommendations(recsRes.data.suggestions || []);
                    setRecReason(recsRes.data.reason || 'Suggested for You');
                }

                setError('');
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Unable to load books. Please try again later.');
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Helper to get book image or placeholder
    const getBookImage = (book) => {
        // Check if image exists and is a valid URL
        if (book.image && (book.image.startsWith('http://') || book.image.startsWith('https://'))) {
            return book.image;
        }
        return assets.landing.featured;
    };

    // Fallback for broken images
    const handleImageError = (e) => {
        e.target.src = assets.landing.featured;
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
                    {/* === WELCOME SECTION === */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Welcome back</span>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                                    Discover your next <span className="font-black italic text-primary">great read</span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary max-w-md">
                                Explore thousands of books from verified sellers.
                            </p>
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
                    {!loading && !error && books.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="text-xl font-medium text-text-primary mb-2">No books available yet</h3>
                            <p className="text-text-secondary">Check back later for new listings!</p>
                        </div>
                    )}

                    {/* Books Content - Only show when we have data */}
                    {!loading && !error && books.length > 0 && (
                        <>
                            {/* === SUGGESTED FOR YOU - Hero Layout === */}
                            {recommendations.length > 0 && (
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-px bg-primary" />
                                            <h2 className="text-lg font-medium text-text-primary">{recReason}</h2>
                                        </div>
                                    </div>

                                    {/* Hero Grid: Featured + 3 Cards */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                                        {/* Featured Book - Left Side */}
                                        {recommendations[0] && (
                                            <Link to={`/buyer/book/${recommendations[0]?._id}`} state={{ from: 'suggested' }} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/10 p-6 group cursor-pointer">
                                                <div className="flex gap-5 h-full">
                                                    <div className="w-36 flex-shrink-0">
                                                        <div className="relative h-52 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                                            <img
                                                                src={getBookImage(recommendations[0])}
                                                                alt={recommendations[0]?.title}
                                                                onError={handleImageError}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium">Featured Pick</span>
                                                        <h3 className="text-xl font-serif text-text-primary mt-2 group-hover:text-primary transition-colors">
                                                            {recommendations[0]?.title}
                                                        </h3>
                                                        <p className="text-sm text-text-secondary mt-1">{recommendations[0]?.author}</p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="text-sm text-text-secondary">4.8</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-2 mt-4">
                                                            <span className="text-2xl font-bold text-text-primary">₹{recommendations[0]?.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}

                                        {/* Right Side - 3 Smaller Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                                            {recommendations.slice(1, 4).map((book) => (
                                                <Link
                                                    key={book._id}
                                                    to={`/buyer/book/${book._id}`}
                                                    state={{ from: 'suggested' }}
                                                    className="group bg-background-alt/50 border border-border hover:border-primary/30 rounded-xl p-3 transition-all hover:shadow-lg"
                                                >
                                                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
                                                        <img
                                                            src={getBookImage(book)}
                                                            alt={book.title}
                                                            onError={handleImageError}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <h4 className="font-medium text-text-primary text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                        {book.title}
                                                    </h4>
                                                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{book.author}</p>
                                                    <p className="text-sm font-bold text-text-primary mt-2">₹{book.price}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* === CATEGORIES FILTER === */}
                            <section className="mb-6">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all cursor-pointer ${activeCategory === cat
                                                ? 'bg-primary text-white'
                                                : 'bg-background-alt text-text-secondary hover:bg-background-alt/80 hover:text-text-primary'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* === ALL BOOKS GRID === */}
                            <section>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-px bg-primary" />
                                        <h2 className="text-lg font-medium text-text-primary">
                                            {activeCategory === 'All' ? 'All Books' : activeCategory}
                                        </h2>
                                        <span className="text-sm text-text-muted">({filteredBooks.length} books)</span>
                                    </div>
                                </div>

                                {filteredBooks.length === 0 ? (
                                    <div className="text-center py-12 text-text-secondary">
                                        No books found in this category.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                        {filteredBooks.map((book) => (
                                            <Link
                                                key={book._id}
                                                to={`/buyer/book/${book._id}`}
                                                state={{ from: 'home' }}
                                                className="group bg-background border border-border hover:border-primary/30 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                                            >
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
                                                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                                                            <span className="text-yellow-400">★</span> 4.5
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-text-muted mt-1 line-clamp-1">
                                                        by {book.seller?.fullname || 'Unknown Seller'}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BuyerHome;
