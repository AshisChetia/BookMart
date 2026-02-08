import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const BuyerHome = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample book data - replace with API data later
    const books = [
        { id: 1, title: "The Psychology of Money", author: "Morgan Housel", price: 299, originalPrice: 450, image: assets.landing.featured, category: "Non-Fiction", rating: 4.8, seller: "BookWorm Store" },
        { id: 2, title: "Atomic Habits", author: "James Clear", price: 349, originalPrice: 499, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.9, seller: "Reader's Paradise" },
        { id: 3, title: "The Silent Patient", author: "Alex Michaelides", price: 275, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Page Turner" },
        { id: 4, title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, originalPrice: 450, image: assets.categories.fiction, category: "Fiction", rating: 4.7, seller: "Literary Hub" },
        { id: 5, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 399, originalPrice: 550, image: assets.categories.nonFiction, category: "Non-Fiction", rating: 4.5, seller: "Mind Books" },
        { id: 6, title: "The Alchemist", author: "Paulo Coelho", price: 199, originalPrice: 299, image: assets.categories.fiction, category: "Fiction", rating: 4.8, seller: "Classic Reads" },
        { id: 7, title: "Deep Work", author: "Cal Newport", price: 325, originalPrice: 450, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.4, seller: "Focus Books" },
        { id: 8, title: "Gone Girl", author: "Gillian Flynn", price: 280, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Suspense Central" },
    ];

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Self-Help', 'Thriller', 'Academic'];
    const suggestedBooks = books.slice(0, 4);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

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

                    {/* === SUGGESTED FOR YOU - Hero Layout === */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-px bg-primary" />
                                <h2 className="text-lg font-medium text-text-primary">Suggested for You</h2>
                            </div>
                            <button className="text-sm text-text-secondary hover:text-primary flex items-center gap-1 group cursor-pointer">
                                View All
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Hero Grid: Featured + 3 Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Featured Book - Left Side */}
                            <Link to={`/buyer/book/${suggestedBooks[0]?.id}`} state={{ from: 'suggested' }} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/10 p-6 group cursor-pointer">
                                <div className="flex gap-5 h-full">
                                    <div className="w-36 flex-shrink-0">
                                        <div className="relative h-52 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                            <img
                                                src={suggestedBooks[0]?.image}
                                                alt={suggestedBooks[0]?.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium">Featured Pick</span>
                                        <h3 className="text-xl font-serif text-text-primary mt-2 group-hover:text-primary transition-colors">
                                            {suggestedBooks[0]?.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary mt-1">{suggestedBooks[0]?.author}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm font-medium text-text-primary">{suggestedBooks[0]?.rating}</span>
                                            <span className="text-xs text-text-muted ml-2">• {suggestedBooks[0]?.category}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-2xl font-bold text-primary">₹{suggestedBooks[0]?.price}</span>
                                            <span className="text-sm text-text-muted line-through">₹{suggestedBooks[0]?.originalPrice}</span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                {Math.round((1 - suggestedBooks[0]?.price / suggestedBooks[0]?.originalPrice) * 100)}% off
                                            </span>
                                        </div>
                                        <span className="mt-4 px-5 py-2.5 bg-text-primary text-background text-sm font-medium rounded-full hover:bg-primary transition-colors cursor-pointer w-fit">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Right Side - 3 Cards Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {suggestedBooks.slice(1, 4).map((book) => (
                                    <Link key={book.id} to={`/buyer/book/${book.id}`} state={{ from: 'suggested' }} className="group cursor-pointer">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-background-alt shadow-sm hover:shadow-lg transition-all">
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Wishlist */}
                                            <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            {/* Quick Add */}
                                            <button className="absolute bottom-2 left-2 right-2 py-2 bg-white text-text-primary text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer hover:bg-primary hover:text-white">
                                                Quick Add
                                            </button>
                                        </div>
                                        <h3 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
                                        <p className="text-xs text-text-secondary mt-0.5">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-bold text-primary">₹{book.price}</span>
                                            <span className="text-[10px] text-text-muted line-through">₹{book.originalPrice}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* === CATEGORY FILTERS === */}
                    <section className="mb-5">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${activeCategory === category
                                        ? 'bg-text-primary text-background'
                                        : 'bg-background-alt text-text-secondary hover:bg-border hover:text-text-primary'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* === BOOK GRID === */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-medium text-text-primary">
                                {activeCategory === 'All' ? 'All Books' : activeCategory}
                                <span className="text-text-muted text-sm ml-2">({filteredBooks.length})</span>
                            </h2>
                            <select className="px-3 py-1.5 bg-background-alt border border-border rounded-lg text-xs text-text-secondary focus:outline-none focus:border-primary cursor-pointer">
                                <option>Relevance</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredBooks.map((book) => (
                                <Link key={book.id} to={`/buyer/book/${book.id}`} state={{ from: 'category', categoryName: activeCategory }} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-background-alt shadow-sm hover:shadow-lg transition-all duration-300">
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Rating badge */}
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm rounded text-[10px] font-medium flex items-center gap-0.5">
                                            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {book.rating}
                                        </div>

                                        {/* Wishlist button */}
                                        <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white transition-all cursor-pointer">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>

                                        {/* Add to cart on hover */}
                                        <button className="absolute bottom-2 left-2 right-2 py-2 bg-white text-text-primary text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer">
                                            Add to Cart
                                        </button>
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
                        {filteredBooks.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-14 h-14 mx-auto mb-4 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-medium text-text-primary mb-1">No books found</h3>
                                <p className="text-sm text-text-secondary">Try adjusting your filters</p>
                            </div>
                        )}
                    </section>

                    {/* === BROWSE BY CATEGORY QUICK LINKS === */}
                    <section className="mb-10">
                        <h2 className="text-base font-medium text-text-primary mb-4">Browse by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Fiction', 'Non-Fiction', 'Self-Help', 'Thriller'].map((cat) => (
                                <Link
                                    key={cat}
                                    to={`/buyer/categories/${cat.toLowerCase().replace(' ', '-')}`}
                                    className="p-4 bg-background-alt border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <h3 className="text-sm font-medium text-text-primary group-hover:text-primary">{cat}</h3>
                                    <p className="text-xs text-text-muted mt-1">Explore →</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* === WHY BOOKMART === */}
                    <section className="mb-6">
                        <div className="bg-background-alt border border-border rounded-2xl p-6 md:p-8">
                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-text-primary">Verified Sellers</h3>
                                    <p className="text-xs text-text-muted mt-1">100% trusted</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-text-primary">Best Prices</h3>
                                    <p className="text-xs text-text-muted mt-1">Save up to 50%</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-text-primary">Fast Delivery</h3>
                                    <p className="text-xs text-text-muted mt-1">2-5 business days</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-text-primary">Easy Returns</h3>
                                    <p className="text-xs text-text-muted mt-1">7-day policy</p>
                                </div>
                            </div>

                            {/* Quote + Stats */}
                            <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left max-w-md">
                                    <p className="text-lg italic text-text-secondary font-serif">
                                        "A reader lives a thousand lives before he dies."
                                    </p>
                                    <p className="text-xs text-text-muted mt-2">— George R.R. Martin</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">10K+</p>
                                        <p className="text-xs text-text-muted">Books</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">500+</p>
                                        <p className="text-xs text-text-muted">Sellers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">25K+</p>
                                        <p className="text-xs text-text-muted">Happy Readers</p>
                                    </div>
                                </div>
                            </div>
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

export default BuyerHome;
