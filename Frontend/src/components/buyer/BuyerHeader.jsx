import { useState } from 'react';
import { Link } from 'react-router-dom';

const BuyerHeader = ({ searchQuery, setSearchQuery, onMenuClick }) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 md:py-4">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Left - Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-1.5 sm:p-2 text-text-secondary hover:text-text-primary hover:bg-background-alt rounded-lg transition-all cursor-pointer flex-shrink-0"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Center - Search Bar (Hidden on very small screens when collapsed) */}
                    <div className={`${mobileSearchOpen ? 'flex' : 'hidden'} sm:flex flex-1 max-w-2xl mx-auto`}>
                        <div className="relative group w-full">
                            <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-11 md:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-background-alt border border-border rounded-full text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                            {/* Close button for mobile search */}
                            <button
                                onClick={() => setMobileSearchOpen(false)}
                                className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right - Actions */}
                    <div className={`${mobileSearchOpen ? 'hidden' : 'flex'} sm:flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0`}>
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(true)}
                            className="sm:hidden p-1.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <Link to="/buyer/cart" className="p-1.5 sm:p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </Link>

                        {/* Notification */}
                        <button className="p-1.5 sm:p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="text-base sm:text-lg font-medium text-text-primary tracking-tight hidden xs:block sm:block ml-1">
                            BookMart<span className="text-primary">.</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BuyerHeader;
