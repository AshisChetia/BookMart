import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* Main Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-background/90 backdrop-blur-lg' : ''}`}>
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between">
                    <a href="#" className="text-xl font-medium text-text-primary tracking-tight">
                        BookMart<span className="text-primary">.</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-12">
                        <a href="#about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">About</a>
                        <a href="#explore" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Explore</a>
                        <a href="#join" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Join</a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/auth" className="text-sm text-text-primary hover:text-primary transition-colors cursor-pointer">
                            Login
                        </Link>
                        <Link to="/auth" className="text-sm px-6 py-3 bg-text-primary text-background rounded-full hover:bg-primary transition-all duration-300 cursor-pointer">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 cursor-pointer z-[60]"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-background z-[55] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            >
                {/* Close Button - Top Right */}
                <button
                    className="absolute top-6 right-8 w-12 h-12 flex items-center justify-center text-text-primary hover:text-primary transition-colors cursor-pointer"
                    onClick={closeMenu}
                    aria-label="Close menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Menu Content */}
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {/* Logo */}
                    <a href="#" onClick={closeMenu} className="text-2xl font-medium text-text-primary tracking-tight mb-4">
                        BookMart<span className="text-primary">.</span>
                    </a>

                    {/* Nav Links */}
                    <a href="#about" onClick={closeMenu} className="text-2xl text-text-primary hover:text-primary transition-colors">
                        About
                    </a>
                    <a href="#explore" onClick={closeMenu} className="text-2xl text-text-primary hover:text-primary transition-colors">
                        Explore
                    </a>
                    <a href="#join" onClick={closeMenu} className="text-2xl text-text-primary hover:text-primary transition-colors">
                        Join
                    </a>

                    {/* Divider */}
                    <hr className="w-20 border-border my-4" />

                    {/* Auth Buttons */}
                    <Link
                        to="/auth"
                        onClick={closeMenu}
                        className="text-xl text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        Login
                    </Link>
                    <Link
                        to="/auth"
                        onClick={closeMenu}
                        className="px-10 py-4 bg-text-primary text-background rounded-full text-lg hover:bg-primary transition-colors cursor-pointer"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
