import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BuyerSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            label: 'Browse',
            items: [
                { name: 'Home', path: '/buyer/home', icon: 'home' },
                { name: 'Categories', path: '/buyer/categories', icon: 'grid' },
                { name: 'New Arrivals', path: '/buyer/new', icon: 'sparkles' },
            ]
        },
        {
            label: 'My Account',
            items: [
                { name: 'My Profile', path: '/buyer/profile', icon: 'user' },
                { name: 'My Orders', path: '/buyer/orders', icon: 'package' },
                { name: 'Wishlist', path: '/buyer/wishlist', icon: 'heart' },
                { name: 'Cart', path: '/buyer/cart', icon: 'cart' },
            ]
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            home: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            ),
            grid: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            ),
            sparkles: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            ),
            user: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            ),
            package: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            ),
            heart: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            ),
            cart: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            ),
        };
        return icons[iconName] || icons.home;
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    // Get user initials
    const getUserInitials = () => {
        if (!user?.fullname) return 'U';
        return user.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo & Close */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <Link to="/" className="text-xl font-medium text-text-primary tracking-tight">
                            BookMart<span className="text-primary">.</span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="p-4 mx-4 mt-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
                                {getUserInitials()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-primary truncate">{user?.fullname || 'User'}</p>
                                <p className="text-sm text-text-muted truncate">{user?.email || 'No email'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4">
                        {menuItems.map((section, idx) => (
                            <div key={idx} className="mb-6">
                                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3 px-3">
                                    {section.label}
                                </p>
                                <ul className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    onClick={onClose}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                                                        ? 'bg-primary text-white'
                                                        : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                                        }`}
                                                >
                                                    <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {getIcon(item.icon)}
                                                    </svg>
                                                    <span className="flex-1">{item.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default BuyerSidebar;
