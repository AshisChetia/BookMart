import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { analyticsAPI } from '../../services/api';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const BuyerCategories = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Fiction',
            description: 'Explore imaginative narratives and storytelling at its finest',
            count: 0,
            image: assets.categories.fiction,
        },
        {
            id: 2,
            name: 'Non-Fiction',
            description: 'Real stories, biographies, and factual explorations',
            count: 0,
            image: assets.categories.nonFiction,
        },
        {
            id: 3,
            name: 'Self-Help',
            description: 'Transform your life with practical wisdom and guidance',
            count: 0,
            image: assets.categories.selfHelp,
        },
        {
            id: 4,
            name: 'Thriller',
            description: 'Edge-of-your-seat suspense and mystery',
            count: 0,
            image: assets.categories.thriller,
        },
        {
            id: 5,
            name: 'Romance',
            description: 'Love stories that warm the heart',
            count: 0,
            image: assets.categories.fiction,
        },
        {
            id: 6,
            name: 'Science Fiction',
            description: 'Journey through futures and alternate realities',
            count: 0,
            image: assets.categories.thriller,
        },
        {
            id: 7,
            name: 'Biography',
            description: 'Inspiring life stories of remarkable individuals',
            count: 0,
            image: assets.categories.nonFiction,
        },
        {
            id: 8,
            name: 'History',
            description: 'Journey through time and past events',
            count: 0,
            image: assets.categories.nonFiction,
        },
        {
            id: 9,
            name: 'Business',
            description: 'Insights for professional growth and success',
            count: 0,
            image: assets.categories.selfHelp,
        },
        {
            id: 10,
            name: 'Children',
            description: 'Stories and learning for young minds',
            count: 0,
            image: assets.categories.fiction,
        }
    ]);

    useEffect(() => {
        const fetchCategoryStats = async () => {
            try {
                const response = await analyticsAPI.getCategoryStats();
                if (response.data.success) {
                    const stats = response.data.categories;

                    setCategories(prevCategories =>
                        prevCategories.map(cat => {
                            const stat = stats.find(s => s.name.toLowerCase() === cat.name.toLowerCase());
                            return {
                                ...cat,
                                count: stat ? stat.count : 0
                            };
                        })
                    );
                }
            } catch (error) {
                console.error("Failed to fetch category stats:", error);
            }
        };

        fetchCategoryStats();
    }, []);

    // Quotes Logic
    const [quote, setQuote] = useState({ text: '', author: '' });

    useEffect(() => {
        const quotes = [
            { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
            { text: "So many books, so little time.", author: "Frank Zappa" },
            { text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.", author: "Jane Austen" },
            { text: "Good friends, good books, and a sleepy conscience: this is the ideal life.", author: "Mark Twain" },
            { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" }
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {/* Page Header */}
                    <section className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Browse</span>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                                    Explore by <span className="font-black italic text-primary">Category</span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary max-w-md">
                                Discover books organized by genre. Find your next favorite read.
                            </p>
                        </div>
                    </section>

                    {/* Featured Categories - Large Cards */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-6 h-px bg-primary" />
                            <h2 className="text-lg font-medium text-text-primary">Popular Categories</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredCategories.slice(0, 2).map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/buyer/categories/${category.name.toLowerCase()}`}
                                    className="group relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <p className="text-white/60 text-sm mb-1">{category.count.toLocaleString()} books</p>
                                        <h3 className="text-white text-2xl md:text-3xl font-serif group-hover:text-primary-light transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/70 text-sm mt-2 max-w-md">{category.description}</p>
                                    </div>

                                    <div className="absolute top-4 right-4 w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white/60 group-hover:border-white group-hover:text-white group-hover:bg-white/10 transition-all backdrop-blur-sm">
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* All Categories Grid */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-light text-text-primary">
                                All Categories
                                <span className="text-text-muted text-base ml-2">({filteredCategories.length})</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {filteredCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/buyer/categories/${category.name.toLowerCase()}`}
                                    className="group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer bg-text-primary"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                        <p className="text-gray-300 text-xs font-light tracking-wide">{category.count.toLocaleString()} books</p>
                                        <h3 className="text-white text-lg md:text-xl font-serif mt-1 group-hover:text-primary-light transition-colors">
                                            {category.name}
                                        </h3>
                                    </div>

                                    <div className="absolute top-3 right-3 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center text-white/60 group-hover:border-white group-hover:text-white transition-all backdrop-blur-sm">
                                        <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Literary Quotes Section */}
                    <section className="mb-8">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
                            {/* Decorative Quote mark */}
                            <div className="absolute top-4 left-6 text-9xl text-primary/10 font-serif leading-none select-none">“</div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">Literary Wisdom</span>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-text-primary italic leading-relaxed mb-6">
                                    "{quote.text}"
                                </h2>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="w-8 h-px bg-primary/50"></span>
                                    <p className="text-sm md:text-base font-medium text-text-secondary uppercase tracking-widest">
                                        {quote.author}
                                    </p>
                                    <span className="w-8 h-px bg-primary/50"></span>
                                </div>
                            </div>
                        </div>
                    </section>
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

export default BuyerCategories;
