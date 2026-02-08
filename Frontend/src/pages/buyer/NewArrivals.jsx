import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const NewArrivals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // Sample new arrivals data - replace with API data later
    const newBooks = [
        { id: 1, title: "The Psychology of Money", author: "Morgan Housel", price: 299, originalPrice: 450, image: assets.landing.featured, category: "Non-Fiction", rating: 4.8, seller: "BookWorm Store", daysAgo: 1 },
        { id: 2, title: "Atomic Habits", author: "James Clear", price: 349, originalPrice: 499, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.9, seller: "Reader's Paradise", daysAgo: 2 },
        { id: 3, title: "The Silent Patient", author: "Alex Michaelides", price: 275, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Page Turner", daysAgo: 3 },
        { id: 4, title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, originalPrice: 450, image: assets.categories.fiction, category: "Fiction", rating: 4.7, seller: "Literary Hub", daysAgo: 4 },
        { id: 5, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 399, originalPrice: 550, image: assets.categories.nonFiction, category: "Non-Fiction", rating: 4.5, seller: "Mind Books", daysAgo: 5 },
        { id: 6, title: "The Alchemist", author: "Paulo Coelho", price: 199, originalPrice: 299, image: assets.categories.fiction, category: "Fiction", rating: 4.8, seller: "Classic Reads", daysAgo: 6 },
        { id: 7, title: "Deep Work", author: "Cal Newport", price: 325, originalPrice: 450, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.4, seller: "Focus Books", daysAgo: 7 },
        { id: 8, title: "Gone Girl", author: "Gillian Flynn", price: 280, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Suspense Central", daysAgo: 8 },
    ];

    const filteredBooks = newBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sortBy === 'newest') return a.daysAgo - b.daysAgo;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

    const getTimeLabel = (daysAgo) => {
        if (daysAgo === 1) return 'Today';
        if (daysAgo === 2) return 'Yesterday';
        if (daysAgo <= 7) return `${daysAgo} days ago`;
        return `${Math.ceil(daysAgo / 7)} week${daysAgo > 14 ? 's' : ''} ago`;
    };

    return (
        <div className="min-h-screen bg-background font-sans flex">
            {/* Sidebar */}
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <BuyerHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Main Content */}
                <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">
                    {/* === PAGE HEADER === */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                                    <Link to="/buyer/home" className="hover:text-primary transition-colors">Home</Link>
                                    <span>/</span>
                                    <span className="text-text-primary">New Arrivals</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary flex items-center gap-3">
                                    <span className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </span>
                                    <span>
                                        Fresh <span className="font-black italic text-primary">New Arrivals</span>
                                    </span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary max-w-md">
                                Discover the latest books added to our collection. Updated daily!
                            </p>
                        </div>
                    </section>

                    {/* === STATS BAR === */}
                    <section className="mb-8">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm font-medium text-primary">{newBooks.length} New This Week</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-amber-700">Updated Daily</span>
                            </div>
                        </div>
                    </section>

                    {/* === SORT OPTIONS === */}
                    <section className="mb-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-text-secondary">
                                Showing <span className="font-medium text-text-primary">{sortedBooks.length}</span> new books
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-background-alt border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:border-primary cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </section>

                    {/* === BOOKS GRID === */}
                    <section className="mb-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {sortedBooks.map((book) => (
                                <Link key={book.id} to={`/buyer/book/${book.id}`} state={{ from: 'new-arrivals' }} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-background-alt shadow-sm hover:shadow-lg transition-all duration-300">
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* New Badge */}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                                            {getTimeLabel(book.daysAgo)}
                                        </div>

                                        {/* Rating badge */}
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm rounded text-[10px] font-medium flex items-center gap-0.5">
                                            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {book.rating}
                                        </div>

                                        {/* View Details on hover */}
                                        <span className="absolute bottom-2 left-2 right-2 py-2 bg-white text-text-primary text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-center">
                                            View Details
                                        </span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                                        <p className="text-[10px] text-text-secondary">{book.author}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-primary">₹{book.price}</span>
                                            <span className="text-[10px] text-text-muted line-through">₹{book.originalPrice}</span>
                                            <span className="text-[9px] text-green-600 font-medium ml-auto">
                                                {Math.round((1 - book.price / book.originalPrice) * 100)}% off
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty state */}
                        {sortedBooks.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-14 h-14 mx-auto mb-4 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-medium text-text-primary mb-1">No books found</h3>
                                <p className="text-sm text-text-secondary">Try adjusting your search</p>
                            </div>
                        )}
                    </section>

                    {/* === READING QUOTE === */}
                    <section className="mb-6">
                        <div className="bg-background-alt border border-border rounded-2xl p-8 text-center">
                            <svg className="w-8 h-8 mx-auto mb-4 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-xl md:text-2xl italic text-text-secondary font-serif max-w-2xl mx-auto">
                                "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
                            </p>
                            <p className="text-sm text-text-muted mt-4">— Dr. Seuss</p>
                        </div>
                    </section>
                </main>

                {/* Footer */}
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

export default NewArrivals;
