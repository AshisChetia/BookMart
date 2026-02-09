import { useState } from 'react';
import { Link } from 'react-router-dom';

const SellerHeader = ({ onMenuClick }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const notifications = [
        { id: 1, type: 'order', message: 'New order received for "The Psychology of Money"', time: '2 min ago', unread: true },
        { id: 2, type: 'review', message: 'New 5-star review on "Atomic Habits"', time: '1 hour ago', unread: true },
        { id: 3, type: 'stock', message: '"Deep Work" is running low on stock (2 left)', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                {/* Left - Menu & Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-medium text-text-primary">Seller Dashboard</h1>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Quick Add Book */}
                    <Link
                        to="/seller/books/new"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Book
                    </Link>

                    {/* Mobile Add Button */}
                    <Link
                        to="/seller/books/new"
                        className="sm:hidden p-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer relative"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {notificationsOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-4 border-b border-border flex items-center justify-between">
                                        <h3 className="font-medium text-text-primary">Notifications</h3>
                                        <button className="text-xs text-primary hover:underline cursor-pointer">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-border last:border-0 hover:bg-background-alt transition-colors cursor-pointer ${notification.unread ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.unread ? 'bg-primary' : 'bg-transparent'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-text-primary line-clamp-2">{notification.message}</p>
                                                        <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-border bg-background-alt">
                                        <Link to="/seller/notifications" className="block text-center text-sm text-primary hover:underline">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile */}
                    <Link to="/seller/profile" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
                            BW
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;
