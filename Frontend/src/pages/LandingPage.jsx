import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import { analyticsAPI } from '../services/api';

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([
        { name: 'Fiction', count: 0, image: assets.categories.fiction },
        { name: 'Non-Fiction', count: 0, image: assets.categories.nonFiction },
        { name: 'Self-Help', count: 0, image: assets.categories.selfHelp },
        { name: 'Thriller', count: 0, image: assets.categories.thriller },
        { name: 'Romance', count: 0, image: assets.categories.fiction },
        { name: 'Science Fiction', count: 0, image: assets.categories.thriller },
        { name: 'Biography', count: 0, image: assets.categories.nonFiction },
        { name: 'History', count: 0, image: assets.categories.nonFiction },
        { name: 'Business', count: 0, image: assets.categories.selfHelp },
        { name: 'Children', count: 0, image: assets.categories.fiction }
    ]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        // Reset state on mount to ensure clean state when navigating back
        setShowAllCategories(false);

        // Fetch category stats
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

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background overflow-x-hidden font-sans">
            {/* === NAVBAR COMPONENT === */}
            <Navbar />

            {/* === HERO - MAGAZINE COVER === */}
            <section className="relative min-h-screen flex items-center">
                {/* Large Background Text - Hidden on mobile */}
                <div className="hidden lg:flex absolute inset-0 items-center justify-center overflow-hidden pointer-events-none select-none">
                    <h1
                        className="text-[15vw] font-black text-primary/5 leading-none tracking-tighter"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    >
                        BOOKS
                    </h1>
                </div>

                {/* Grid Layout */}
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 pt-32 pb-20 grid lg:grid-cols-12 gap-8 relative z-10">
                    {/* Left Column - Editorial Content */}
                    <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
                        {/* Issue Tag */}
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-px bg-text-primary" />
                            <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Est. 2026</span>
                        </div>

                        {/* Main Heading - Magazine Style */}
                        <div className="space-y-2">
                            <h1 className="text-[12vw] lg:text-[6vw] font-light text-text-primary leading-[0.9] tracking-tight">
                                Where
                            </h1>
                            <h1 className="text-[12vw] lg:text-[6vw] font-black text-text-primary leading-[0.9] tracking-tight italic">
                                Stories
                            </h1>
                            <h1 className="text-[12vw] lg:text-[6vw] font-light text-text-primary leading-[0.9] tracking-tight">
                                Find <span className="text-primary font-black not-italic">You</span>
                            </h1>
                        </div>

                        {/* Subtext */}
                        <p className="text-lg text-text-secondary max-w-md leading-relaxed">
                            A curated marketplace connecting passionate readers with unique booksellers.
                            Discover rare finds and timeless classics.
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <button
                                onClick={() => navigate('/auth?mode=signup&role=reader')}
                                className="group relative px-10 py-5 bg-text-primary text-background font-medium overflow-hidden cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Start Exploring
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Featured Visual */}
                    <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">
                        {/* Main Featured Book - Psychology of Money (CENTER) */}
                        <div
                            className="relative z-20 w-64 md:w-80 group cursor-pointer"
                            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
                        >
                            <div className="rounded-lg shadow-2xl shadow-primary/30 aspect-[3/4] overflow-hidden transform group-hover:scale-105 transition-transform duration-500 ">
                                <img
                                    src={assets.landing.featured}
                                    alt="Psychology of Money - Top Seller"
                                    className="w-full h-full object-cover"
                                    style={{
                                        imageRendering: 'auto',
                                        WebkitBackfaceVisibility: 'hidden'
                                    }}
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center text-text-primary font-bold text-xs text-center leading-tight transform rotate-12 shadow-lg">
                                Best<br />Seller
                            </div>
                        </div>

                        {/* Rich Dad Poor Dad - TOP LEFT */}
                        <div
                            className="absolute top-0 left-0 w-48 md:w-56"
                            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                        >
                            <div className="rounded-lg aspect-[3/4] shadow-xl overflow-hidden">
                                <img
                                    src={assets.landing.background1}
                                    alt="Rich Dad Poor Dad"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Third Book - BOTTOM RIGHT */}
                        <div
                            className="absolute bottom-0 right-0 w-40 md:w-48 "
                            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                        >
                            <div className="rounded-lg aspect-[3/4] shadow-xl overflow-hidden">
                                <img
                                    src={assets.landing.background2}
                                    alt="Featured Book"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border border-border/30 rounded-full pointer-events-none" />
                    </div>
                </div>

                {/* Bottom Marquee */}
                <div className="absolute bottom-0 left-0 right-0 py-4 border-t border-border overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-8 text-sm text-text-muted flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                Fiction • Non-Fiction • Rare Editions • First Prints • Signed Copies • Academic
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* === ABOUT SECTION === */}
            <section id="about" className="py-32 bg-background-alt">
                <div className="max-w-[1800px] mx-auto px-8 md:px-16">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        {/* Left - Number/Stats */}
                        <div className="lg:col-span-4 space-y-12">
                            {[
                                { number: "10K+", label: "Active Readers" },
                                { number: "5K+", label: "Books Listed" },
                                { number: "500+", label: "Verified Sellers" },
                            ].map((stat, i) => (
                                <div key={i} className="group">
                                    <p className="text-6xl md:text-7xl font-black text-text-primary group-hover:text-primary transition-colors duration-300">
                                        {stat.number}
                                    </p>
                                    <p className="text-text-muted mt-2">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right - Content */}
                        <div className="lg:col-span-8 space-y-8">
                            <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">About Us</span>
                            <h2 className="text-4xl md:text-6xl font-light text-text-primary leading-tight">
                                We believe every book<br />
                                deserves a <span className="font-black italic text-primary">new chapter</span>
                            </h2>
                            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                                BookMart isn't just a marketplace—it's a community of bibliophiles,
                                collectors, and curious minds. We connect passionate sellers with eager readers,
                                giving pre-loved books and rare editions a chance to inspire once more.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                {["Curated Selection", "Verified Sellers", "Secure Payments", "Direct Connection"].map((tag, i) => (
                                    <span key={i} className="px-5 py-2 border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === EXPLORE CATEGORIES === */}
            <section id="explore" className="py-32">
                <div className="max-w-[1800px] mx-auto px-8 md:px-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Categories</span>
                            <h2 className="text-4xl md:text-6xl font-light text-text-primary mt-4">
                                Browse by <span className="font-black italic">Genre</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowAllCategories(prev => !prev)}
                            className="text-text-primary font-medium flex items-center gap-2 group cursor-pointer select-none"
                            type="button"
                        >
                            {showAllCategories ? "View Less" : "View All"}
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${showAllCategories ? 'rotate-180' : 'group-hover:translate-x-1'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.slice(0, showAllCategories ? undefined : 4).map((cat, i) => (
                            <div key={i} className="group relative aspect-[4/5] bg-text-primary rounded-lg overflow-hidden cursor-pointer">
                                <div className="absolute inset-0">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                                    <p className="text-gray-300 text-sm font-light tracking-wide">{cat.count.toLocaleString()} books</p>
                                    <h3 className="text-white text-3xl font-serif mt-2 group-hover:text-primary-light transition-colors">
                                        {cat.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === JOIN CTA === */}
            <section id="join" className="py-32 bg-text-primary relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="max-w-[1200px] mx-auto px-8 md:px-16 text-center relative z-10">
                    <span className="text-xs tracking-[0.3em] uppercase text-background/50">Join the Community</span>
                    <h2 className="text-4xl md:text-7xl font-light text-background mt-8 leading-tight">
                        Ready to start your<br />
                        <span className="font-black italic">literary journey</span>?
                    </h2>
                    <p className="text-background/60 text-lg mt-8 max-w-xl mx-auto">
                        Whether you're looking to discover your next favorite read or share your collection with the world.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                        <button
                            onClick={() => navigate('/auth?mode=signup')}
                            className="group relative px-12 py-5 bg-background text-text-primary font-medium overflow-hidden cursor-pointer"
                        >
                            <span className="relative z-10">Create Account</span>
                            <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="absolute inset-0 z-10 flex items-center justify-center text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300">Create Account</span>
                        </button>
                        <button
                            onClick={() => navigate('/auth?mode=signup&role=seller')}
                            className="px-12 py-5 border border-background/30 text-background font-medium hover:bg-background/10 transition-colors cursor-pointer"
                        >
                            Become a Seller
                        </button>
                    </div>
                </div>
            </section>

            {/* === FOOTER COMPONENT === */}
            <Footer />
        </div>
    );
};

export default LandingPage;
