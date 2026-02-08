import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const CategoryBooks = () => {
    const { categoryName } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');

    // Format category name for display (lowercase URL param -> Title Case)
    const formattedCategory = categoryName
        ? categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'All';

    // All books data - in real app this would come from API
    const allBooks = [
        // Fiction
        { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 199, originalPrice: 299, image: assets.categories.fiction, category: "Fiction", rating: 4.8, seller: "Classic Reads" },
        { id: 2, title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, originalPrice: 450, image: assets.categories.fiction, category: "Fiction", rating: 4.7, seller: "Literary Hub" },
        { id: 3, title: "1984", author: "George Orwell", price: 180, originalPrice: 250, image: assets.categories.fiction, category: "Fiction", rating: 4.9, seller: "Classic Reads" },
        { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", price: 220, originalPrice: 320, image: assets.categories.fiction, category: "Fiction", rating: 4.8, seller: "Literary Hub" },

        // Non-Fiction
        { id: 5, title: "The Psychology of Money", author: "Morgan Housel", price: 299, originalPrice: 450, image: assets.landing.featured, category: "Non-Fiction", rating: 4.8, seller: "BookWorm Store" },
        { id: 6, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 399, originalPrice: 550, image: assets.categories.nonFiction, category: "Non-Fiction", rating: 4.5, seller: "Mind Books" },
        { id: 7, title: "Sapiens", author: "Yuval Noah Harari", price: 450, originalPrice: 599, image: assets.categories.nonFiction, category: "Non-Fiction", rating: 4.7, seller: "Knowledge Hub" },
        { id: 8, title: "Educated", author: "Tara Westover", price: 350, originalPrice: 450, image: assets.categories.nonFiction, category: "Non-Fiction", rating: 4.6, seller: "BookWorm Store" },

        // Self-Help
        { id: 9, title: "Atomic Habits", author: "James Clear", price: 349, originalPrice: 499, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.9, seller: "Reader's Paradise" },
        { id: 10, title: "Deep Work", author: "Cal Newport", price: 325, originalPrice: 450, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.4, seller: "Focus Books" },
        { id: 11, title: "The 7 Habits", author: "Stephen Covey", price: 280, originalPrice: 399, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.6, seller: "Mind Books" },
        { id: 12, title: "Mindset", author: "Carol Dweck", price: 299, originalPrice: 420, image: assets.categories.selfHelp, category: "Self-Help", rating: 4.5, seller: "Growth Books" },

        // Thriller
        { id: 13, title: "The Silent Patient", author: "Alex Michaelides", price: 275, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Page Turner" },
        { id: 14, title: "Gone Girl", author: "Gillian Flynn", price: 280, originalPrice: 399, image: assets.categories.thriller, category: "Thriller", rating: 4.6, seller: "Suspense Central" },
        { id: 15, title: "The Girl on the Train", author: "Paula Hawkins", price: 250, originalPrice: 350, image: assets.categories.thriller, category: "Thriller", rating: 4.3, seller: "Page Turner" },
        { id: 16, title: "Before I Go to Sleep", author: "S.J. Watson", price: 220, originalPrice: 320, image: assets.categories.thriller, category: "Thriller", rating: 4.2, seller: "Suspense Central" },

        // Romance
        { id: 17, title: "Pride and Prejudice", author: "Jane Austen", price: 150, originalPrice: 220, image: assets.categories.fiction, category: "Romance", rating: 4.9, seller: "Classic Reads" },
        { id: 18, title: "The Notebook", author: "Nicholas Sparks", price: 199, originalPrice: 299, image: assets.categories.fiction, category: "Romance", rating: 4.5, seller: "Romance Books" },
        { id: 19, title: "Outlander", author: "Diana Gabaldon", price: 380, originalPrice: 499, image: assets.categories.fiction, category: "Romance", rating: 4.7, seller: "Epic Tales" },

        // Science Fiction
        { id: 20, title: "Dune", author: "Frank Herbert", price: 399, originalPrice: 550, image: assets.categories.thriller, category: "Science Fiction", rating: 4.8, seller: "Sci-Fi World" },
        { id: 21, title: "Foundation", author: "Isaac Asimov", price: 320, originalPrice: 450, image: assets.categories.thriller, category: "Science Fiction", rating: 4.7, seller: "Sci-Fi World" },

        // Biography
        { id: 22, title: "Steve Jobs", author: "Walter Isaacson", price: 450, originalPrice: 599, image: assets.categories.nonFiction, category: "Biography", rating: 4.6, seller: "Life Stories" },
        { id: 23, title: "Becoming", author: "Michelle Obama", price: 399, originalPrice: 550, image: assets.categories.nonFiction, category: "Biography", rating: 4.8, seller: "Life Stories" },

        // Academic
        { id: 24, title: "Introduction to Algorithms", author: "Thomas H. Cormen", price: 899, originalPrice: 1200, image: assets.categories.selfHelp, category: "Academic", rating: 4.5, seller: "Academic Hub" },
        { id: 25, title: "Physics: Principles", author: "David Halliday", price: 750, originalPrice: 999, image: assets.categories.selfHelp, category: "Academic", rating: 4.4, seller: "Academic Hub" },
    ];

    // Filter books by category
    const categoryBooks = allBooks.filter(book =>
        book.category.toLowerCase().replace(' ', '-') === categoryName?.toLowerCase() ||
        book.category.toLowerCase() === categoryName?.toLowerCase()
    );

    // Further filter by search query
    const filteredBooks = categoryBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort books
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    // Category info for header
    const categoryInfo = {
        'fiction': { description: 'Explore imaginative narratives and storytelling at its finest', color: 'from-emerald-500/20' },
        'non-fiction': { description: 'Real stories, biographies, and factual explorations', color: 'from-blue-500/20' },
        'self-help': { description: 'Transform your life with practical wisdom and guidance', color: 'from-amber-500/20' },
        'thriller': { description: 'Edge-of-your-seat suspense and mystery', color: 'from-red-500/20' },
        'romance': { description: 'Love stories that warm the heart', color: 'from-pink-500/20' },
        'science-fiction': { description: 'Journey through futures and alternate realities', color: 'from-purple-500/20' },
        'biography': { description: 'Inspiring life stories of remarkable individuals', color: 'from-teal-500/20' },
        'academic': { description: 'Textbooks and educational resources', color: 'from-gray-500/20' },
    };

    const currentCategoryInfo = categoryInfo[categoryName?.toLowerCase()] || { description: 'Browse our collection', color: 'from-primary/20' };

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
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link to="/buyer/home" className="text-text-muted hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="text-text-muted">/</li>
                            <li>
                                <Link to="/buyer/categories" className="text-text-muted hover:text-primary transition-colors">Categories</Link>
                            </li>
                            <li className="text-text-muted">/</li>
                            <li className="text-text-primary font-medium">{formattedCategory}</li>
                        </ol>
                    </nav>

                    {/* Category Header */}
                    <section className={`mb-10 p-6 md:p-8 rounded-xl bg-gradient-to-r ${currentCategoryInfo.color} to-transparent border border-border`}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Category</span>
                                <h1 className="text-2xl md:text-4xl font-serif text-text-primary mt-2">
                                    {formattedCategory}
                                </h1>
                                <p className="text-sm text-text-secondary mt-2 max-w-lg">
                                    {currentCategoryInfo.description}
                                </p>
                            </div>
                            <p className="text-lg font-medium text-primary">
                                {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'}
                            </p>
                        </div>
                    </section>

                    {/* Filters & Sort */}
                    <section className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                            <span className="text-sm text-text-secondary whitespace-nowrap">Quick filters:</span>
                            <button className="px-3 py-1.5 rounded-full text-xs border border-primary bg-primary/5 text-primary">All</button>
                            <button className="px-3 py-1.5 rounded-full text-xs border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors">Under ₹300</button>
                            <button className="px-3 py-1.5 rounded-full text-xs border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors">Top Rated</button>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 bg-background-alt border border-border rounded-lg text-xs text-text-secondary focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="relevance">Sort: Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </section>

                    {/* Books Grid */}
                    <section className="mb-12">
                        {sortedBooks.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                {sortedBooks.map((book) => (
                                    <Link key={book.id} to={`/buyer/book/${book.id}`} state={{ from: 'category', categoryName: formattedCategory }} className="group cursor-pointer">
                                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-background-alt shadow-sm hover:shadow-lg transition-shadow duration-300">
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Rating badge */}
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm rounded text-[10px] font-medium flex items-center gap-0.5">
                                                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {book.rating}
                                            </div>

                                            {/* Wishlist button */}
                                            <button onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white transition-all cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            {/* View Details on hover */}
                                            <span className="absolute bottom-3 left-3 right-3 py-2.5 bg-text-primary text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center">
                                                View Details
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                                            <p className="text-xs text-text-secondary">{book.author}</p>
                                            <div className="flex items-center gap-2 pt-0.5">
                                                <span className="text-lg font-bold text-primary">₹{book.price}</span>
                                                <span className="text-xs text-text-muted line-through">₹{book.originalPrice}</span>
                                                <span className="text-[10px] text-green-600 font-medium ml-auto">
                                                    {Math.round((1 - book.price / book.originalPrice) * 100)}% off
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-text-muted">{book.seller}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto mb-6 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-text-primary mb-2">No books found</h3>
                                <p className="text-text-secondary mb-6">We couldn't find any books in this category.</p>
                                <Link
                                    to="/buyer/categories"
                                    className="inline-block px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
                                >
                                    Browse All Categories
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Related Categories */}
                    {sortedBooks.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-lg font-medium text-text-primary mb-4">You might also like</h2>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {Object.keys(categoryInfo)
                                    .filter(cat => cat !== categoryName?.toLowerCase())
                                    .slice(0, 4)
                                    .map(cat => (
                                        <Link
                                            key={cat}
                                            to={`/buyer/categories/${cat}`}
                                            className="px-4 py-2 bg-background-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
                                        >
                                            {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Link>
                                    ))
                                }
                            </div>
                        </section>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-border py-6 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
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

export default CategoryBooks;
