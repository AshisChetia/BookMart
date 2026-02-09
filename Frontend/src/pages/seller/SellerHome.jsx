import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';

const SellerHome = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Stats data - replace with API data
    const stats = [
        {
            label: 'Total Revenue',
            value: '₹48,250',
            change: '+12.5%',
            changeType: 'positive',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'from-green-500/20 to-green-500/5',
            iconColor: 'text-green-600'
        },
        {
            label: 'Total Orders',
            value: '156',
            change: '+8.2%',
            changeType: 'positive',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            bgColor: 'from-blue-500/20 to-blue-500/5',
            iconColor: 'text-blue-600'
        },
        {
            label: 'Books Listed',
            value: '42',
            change: '+3',
            changeType: 'positive',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: 'from-purple-500/20 to-purple-500/5',
            iconColor: 'text-purple-600'
        },
        {
            label: 'Avg. Rating',
            value: '4.9',
            change: '124 reviews',
            changeType: 'neutral',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            bgColor: 'from-amber-500/20 to-amber-500/5',
            iconColor: 'text-amber-600'
        }
    ];

    // Recent orders - replace with API data
    const recentOrders = [
        { id: 'ORD-2026-156', customer: 'Rahul Sharma', book: 'The Psychology of Money', price: 299, status: 'pending', time: '10 min ago' },
        { id: 'ORD-2026-155', customer: 'Priya Patel', book: 'Atomic Habits', price: 349, status: 'accepted', time: '1 hour ago' },
        { id: 'ORD-2026-154', customer: 'Amit Kumar', book: 'Deep Work', price: 325, status: 'shipped', time: '3 hours ago' },
        { id: 'ORD-2026-153', customer: 'Sneha Gupta', book: 'The Alchemist', price: 199, status: 'delivered', time: '1 day ago' },
    ];

    // Top selling books
    const topBooks = [
        { id: 1, title: 'The Psychology of Money', author: 'Morgan Housel', sold: 45, revenue: 13455, image: assets.landing.featured },
        { id: 2, title: 'Atomic Habits', author: 'James Clear', sold: 38, revenue: 13262, image: assets.categories.selfHelp },
        { id: 3, title: 'Deep Work', author: 'Cal Newport', sold: 32, revenue: 10400, image: assets.categories.nonFiction },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-orange-100 text-orange-700',
            accepted: 'bg-purple-100 text-purple-700',
            shipped: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            {/* Sidebar */}
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Welcome Section */}
                    <section className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                                    Welcome back, <span className="font-bold text-primary">BookWorm Store</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Here's what's happening with your store today.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-text-muted">Last updated:</span>
                                <span className="text-xs text-text-secondary">Just now</span>
                            </div>
                        </div>
                    </section>

                    {/* Stats Cards */}
                    <section className="mb-6 sm:mb-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border border-border rounded-xl p-4 sm:p-5`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm text-text-secondary truncate">{stat.label}</p>
                                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
                                            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${stat.changeType === 'positive' ? 'text-green-600' :
                                                stat.changeType === 'negative' ? 'text-red-600' : 'text-text-muted'
                                                }`}>
                                                {stat.change}
                                            </p>
                                        </div>
                                        <div className={`hidden sm:flex w-12 h-12 rounded-xl bg-white/80 items-center justify-center ${stat.iconColor}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-6 h-px bg-primary" />
                            <h2 className="text-base sm:text-lg font-medium text-text-primary">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Link to="/seller/books/new" className="flex items-center gap-3 p-4 bg-background-alt border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-text-primary">Add Book</span>
                            </Link>
                            <Link to="/seller/orders?status=pending" className="flex items-center gap-3 p-4 bg-background-alt border border-border rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-text-primary block">Pending</span>
                                    <span className="text-xs text-orange-600">3 orders</span>
                                </div>
                            </Link>
                            <Link to="/seller/analytics" className="flex items-center gap-3 p-4 bg-background-alt border border-border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-text-primary">Analytics</span>
                            </Link>
                            <Link to="/seller/profile" className="flex items-center gap-3 p-4 bg-background-alt border border-border rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-text-primary">Store Profile</span>
                            </Link>
                        </div>
                    </section>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Recent Orders - 3 cols */}
                        <section className="lg:col-span-3">
                            <div className="bg-background-alt border border-border rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h2 className="font-medium text-text-primary">Recent Orders</h2>
                                    <Link to="/seller/orders" className="text-sm text-primary hover:underline">View All</Link>
                                </div>
                                <div className="divide-y divide-border">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="p-4 hover:bg-background transition-colors">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-medium text-text-primary">{order.id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-text-secondary mt-1 truncate">{order.book}</p>
                                                    <p className="text-xs text-text-muted mt-0.5">{order.customer} • {order.time}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm font-bold text-primary">₹{order.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Top Selling Books - 2 cols */}
                        <section className="lg:col-span-2">
                            <div className="bg-background-alt border border-border rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h2 className="font-medium text-text-primary">Top Selling</h2>
                                    <Link to="/seller/books" className="text-sm text-primary hover:underline">View All</Link>
                                </div>
                                <div className="divide-y divide-border">
                                    {topBooks.map((book, idx) => (
                                        <div key={book.id} className="p-4 hover:bg-background transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <div className="w-10 h-14 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-text-primary truncate">{book.title}</h3>
                                                    <p className="text-xs text-text-muted">{book.sold} sold</p>
                                                </div>
                                                <p className="text-sm font-bold text-primary">₹{book.revenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="mt-4 sm:mt-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-text-primary">Pro Tip</h3>
                                        <p className="text-sm text-text-secondary mt-1">Books with detailed descriptions and multiple photos sell 40% faster!</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-text-muted">© 2026 BookMart. Seller Dashboard</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Help Center</a>
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Seller Guidelines</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SellerHome;
