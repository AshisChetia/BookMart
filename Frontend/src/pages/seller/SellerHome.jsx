import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerHome = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalOrders: 0,
            totalEarnings: 0,
            totalBooks: 0,
            totalCustomers: 0
        },
        recentOrders: [],
        topBooks: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, ordersRes, topBooksRes] = await Promise.all([
                    analyticsAPI.getSellerDashboard(),
                    analyticsAPI.getRecentOrders(),
                    analyticsAPI.getTopSellingBooks()
                ]);

                setDashboardData({
                    stats: statsRes.data.stats,
                    recentOrders: ordersRes.data.recentOrders,
                    topBooks: topBooksRes.data.topBooks
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Stats data mapped from API
    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${dashboardData.stats.totalEarnings.toLocaleString()}`,
            change: 'Lifetime',
            changeType: 'neutral',
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
            value: dashboardData.stats.totalOrders,
            change: 'All time',
            changeType: 'neutral',
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
            value: dashboardData.stats.totalBooks,
            change: 'Active listings',
            changeType: 'neutral',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: 'from-purple-500/20 to-purple-500/5',
            iconColor: 'text-purple-600'
        },
        {
            label: 'Unique Customers',
            value: dashboardData.stats.totalCustomers,
            change: 'Served so far',
            changeType: 'neutral',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            bgColor: 'from-amber-500/20 to-amber-500/5',
            iconColor: 'text-amber-600'
        }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-orange-100 text-orange-700',
            accepted: 'bg-purple-100 text-purple-700',
            shipped: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
                <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen min-w-0">
                    <SellerHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </main>
                </div>
            </div>
        );
    }

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
                                    Welcome back, <span className="font-bold text-primary">to your Store</span>
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
                                    <span className="text-xs text-orange-600">Orders</span>
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
                                {dashboardData.recentOrders.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {dashboardData.recentOrders.map((order) => (
                                            <div key={order._id} className="p-4 hover:bg-background transition-colors">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-medium text-text-primary text-xs uppercase">{order._id.slice(-6)}</span>
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-text-secondary mt-1 truncate">{order.book?.title || 'Unknown Book'}</p>
                                                        <p className="text-xs text-text-muted mt-0.5">
                                                            {order.buyer?.fullname || 'Customer'} • {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-sm font-bold text-primary">₹{order.totalAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-text-muted text-sm">No orders yet</div>
                                )}
                            </div>
                        </section>

                        {/* Top Selling Books - 2 cols */}
                        <section className="lg:col-span-2">
                            <div className="bg-background-alt border border-border rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h2 className="font-medium text-text-primary">Top Selling</h2>
                                    <Link to="/seller/books" className="text-sm text-primary hover:underline">View All</Link>
                                </div>
                                {dashboardData.topBooks.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {dashboardData.topBooks.map((book, idx) => (
                                            <div key={book.bookId} className="p-4 hover:bg-background transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="w-10 h-14 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => e.target.src = assets.landing.featured}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-text-primary truncate">{book.title}</h3>
                                                        <p className="text-xs text-text-muted">{book.totalQuantitySold} sold</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-primary">₹{book.totalRevenue.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-text-muted text-sm">No sales yet</div>
                                )}
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
