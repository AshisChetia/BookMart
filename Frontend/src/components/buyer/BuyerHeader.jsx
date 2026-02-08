import { Link } from 'react-router-dom';

const BuyerHeader = ({ searchQuery, setSearchQuery, onMenuClick }) => {
    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="px-4 md:px-8 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left - Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-alt rounded-lg transition-all cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Center - Search Bar */}
                    <div className="flex-1 max-w-2xl mx-auto">
                        <div className="relative group">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search books, authors, or genres..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-background-alt border border-border rounded-full text-text-primary text-sm md:text-base placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right - Notification & Logo */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <Link to="/" className="text-lg font-medium text-text-primary tracking-tight hidden sm:block">
                            BookMart<span className="text-primary">.</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BuyerHeader;
