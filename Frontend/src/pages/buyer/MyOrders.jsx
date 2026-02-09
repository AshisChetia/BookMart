import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { orderAPI } from '../../services/api';

const MyOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderAPI.getMyOrders();
                setOrders(response.data.orders || []);
                setError('');
            } catch (err) {
                console.error('Error fetching orders:', err);
                if (err.response?.status === 404) {
                    // No orders found is not an error
                    setOrders([]);
                    setError('');
                } else {
                    setError('Unable to load orders. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Tabs matching backend statuses
    const tabs = [
        { id: 'all', label: 'All Orders', count: orders.length },
        { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
        { id: 'accepted', label: 'Accepted', count: orders.filter(o => o.status === 'accepted').length },
        { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
        { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    ];

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.book?.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            accepted: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            accepted: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            shipped: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
            delivered: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        };
        return icons[status] || icons.pending;
    };

    // Helper to get book image or placeholder
    const getBookImage = (book) => {
        return book?.image || assets.landing.featured;
    };

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
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Your Orders</span>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                                    Track your <span className="font-black italic text-primary">purchases</span>
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* Tabs */}
                    <section className="mb-6">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                                            : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-background-alt text-text-muted'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredOrders.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-xl font-medium text-text-primary mb-2">No orders yet</h3>
                            <p className="text-text-secondary mb-4">Start shopping to see your orders here!</p>
                            <Link to="/buyer/home" className="text-primary hover:underline">
                                Browse Books
                            </Link>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && !error && filteredOrders.length > 0 && (
                        <section className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-background-alt/30 border-b border-border">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div>
                                                <p className="text-xs text-text-muted">Order ID</p>
                                                <p className="font-mono text-sm text-text-primary">{order._id?.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted">Date</p>
                                                <p className="text-sm text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </div>
                                    </div>

                                    {/* Order Item */}
                                    <div className="p-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getBookImage(order.book)}
                                                    alt={order.book?.title || 'Book'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-text-primary line-clamp-1">
                                                    {order.book?.title || 'Book'}
                                                </h3>
                                                <p className="text-sm text-text-secondary line-clamp-1">
                                                    {order.book?.author}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <span className="text-sm text-text-muted">
                                                        Qty: {order.quantity}
                                                    </span>
                                                    <span className="text-sm font-medium text-text-primary">
                                                        ₹{order.totalAmount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="text-xs text-text-muted mb-1">Shipping Address</p>
                                            <p className="text-sm text-text-secondary">{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyOrders;
