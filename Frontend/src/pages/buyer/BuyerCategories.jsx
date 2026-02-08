import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const BuyerCategories = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const categories = [
        {
            id: 1,
            name: 'Fiction',
            description: 'Explore imaginative narratives and storytelling at its finest',
            count: 2340,
            image: assets.categories.fiction,
            featured: ['The Alchemist', 'Where the Crawdads Sing', '1984']
        },
        {
            id: 2,
            name: 'Non-Fiction',
            description: 'Real stories, biographies, and factual explorations',
            count: 1820,
            image: assets.categories.nonFiction,
            featured: ['Atomic Habits', 'Sapiens', 'Educated']
        },
        {
            id: 3,
            name: 'Self-Help',
            description: 'Transform your life with practical wisdom and guidance',
            count: 1150,
            image: assets.categories.selfHelp,
            featured: ['The Psychology of Money', 'Deep Work', 'Mindset']
        },
        {
            id: 4,
            name: 'Thriller',
            description: 'Edge-of-your-seat suspense and mystery',
            count: 890,
            image: assets.categories.thriller,
            featured: ['Gone Girl', 'The Silent Patient', 'The Girl on the Train']
        },
        {
            id: 5,
            name: 'Romance',
            description: 'Love stories that warm the heart',
            count: 1560,
            image: assets.categories.fiction,
            featured: ['Pride and Prejudice', 'The Notebook', 'Outlander']
        },
        {
            id: 6,
            name: 'Science Fiction',
            description: 'Journey through futures and alternate realities',
            count: 780,
            image: assets.categories.thriller,
            featured: ['Dune', 'Foundation', 'Neuromancer']
        },
        {
            id: 7,
            name: 'Biography',
            description: 'Inspiring life stories of remarkable individuals',
            count: 620,
            image: assets.categories.nonFiction,
            featured: ['Steve Jobs', 'Becoming', 'Einstein']
        },
        {
            id: 8,
            name: 'Academic',
            description: 'Textbooks and educational resources',
            count: 450,
            image: assets.categories.selfHelp,
            featured: ['Physics 101', 'Economics Principles', 'Medical Texts']
        },
    ];

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

                    {/* Browse by Interest */}
                    <section className="mb-8">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <span className="text-[10px] tracking-[0.3em] uppercase text-primary">Can't decide?</span>
                                    <h2 className="text-xl md:text-2xl font-light text-text-primary mt-2">
                                        Let us help you <span className="font-black italic">discover</span>
                                    </h2>
                                    <p className="text-sm text-text-secondary mt-2 max-w-md">
                                        Take our quick quiz to get personalized book recommendations based on your interests.
                                    </p>
                                </div>
                                <button className="px-6 py-3 bg-text-primary text-background text-sm font-medium rounded-full hover:bg-primary transition-colors cursor-pointer whitespace-nowrap">
                                    Take the Quiz
                                </button>
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
