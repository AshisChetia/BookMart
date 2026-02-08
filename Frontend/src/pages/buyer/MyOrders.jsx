import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const MyOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    // Dummy orders data - statuses match backend: pending, accepted, shipped, delivered
    const orders = [
        {
            id: 'ORD-2026-001',
            date: '2026-02-06',
            status: 'delivered',
            total: 598,
            items: [
                { title: "The Psychology of Money", author: "Morgan Housel", price: 299, image: assets.landing.featured, qty: 1 },
                { title: "Atomic Habits", author: "James Clear", price: 299, image: assets.categories.selfHelp, qty: 1 },
            ],
            deliveredDate: '2026-02-08',
            seller: 'BookWorm Store',
            shippingAddress: '123 Main St, Mumbai, MH 400001'
        },
        {
            id: 'ORD-2026-002',
            date: '2026-02-05',
            status: 'shipped',
            total: 320,
            items: [
                { title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, image: assets.categories.fiction, qty: 1 },
            ],
            trackingId: 'TRK123456789',
            expectedDate: '2026-02-10',
            seller: 'Literary Hub',
            shippingAddress: '456 Park Ave, Delhi, DL 110001'
        },
        {
            id: 'ORD-2026-003',
            date: '2026-02-04',
            status: 'accepted',
            total: 524,
            items: [
                { title: "Deep Work", author: "Cal Newport", price: 325, image: assets.categories.selfHelp, qty: 1 },
                { title: "The Alchemist", author: "Paulo Coelho", price: 199, image: assets.categories.fiction, qty: 1 },
            ],
            seller: 'Focus Books',
            shippingAddress: '789 Lake Rd, Bangalore, KA 560001'
        },
        {
            id: 'ORD-2026-004',
            date: '2026-02-03',
            status: 'pending',
            total: 275,
            items: [
                { title: "The Silent Patient", author: "Alex Michaelides", price: 275, image: assets.categories.thriller, qty: 1 },
            ],
            seller: 'Page Turner',
            shippingAddress: '321 Hill St, Pune, MH 411001'
        },
    ];

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
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-orange-100 text-orange-700',
            accepted: 'bg-purple-100 text-purple-700',
            shipped: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            shipped: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
            ),
            delivered: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
        return icons[status] || icons.pending;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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
                    {/* === PAGE HEADER === */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                                    <Link to="/buyer/home" className="hover:text-primary transition-colors">Home</Link>
                                    <span>/</span>
                                    <span className="text-text-primary">My Orders</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary flex items-center gap-3">
                                    <span className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </span>
                                    <span>
                                        My <span className="font-black italic text-primary">Orders</span>
                                    </span>
                                </h1>
                            </div>
                            <p className="text-sm text-text-secondary">
                                Track and manage all your book orders
                            </p>
                        </div>
                    </section>

                    {/* === TABS === */}
                    <section className="mb-6">
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary -mb-px'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-background-alt text-text-muted'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* === ORDERS LIST === */}
                    <section className="mb-8">
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-background-alt border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-background">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-medium text-text-primary">{order.id}</span>
                                            <span className="text-xs text-text-muted">•</span>
                                            <span className="text-xs text-text-secondary">{formatDate(order.date)}</span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-text-muted">from</span>
                                            <span className="text-sm font-medium text-text-primary">{order.seller}</span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4">
                                        <div className="flex flex-col gap-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</h3>
                                                        <p className="text-xs text-text-secondary mt-0.5">{item.author}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-sm font-bold text-primary">₹{item.price}</span>
                                                            <span className="text-xs text-text-muted">× {item.qty}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Status Info */}
                                        {order.status === 'pending' && (
                                            <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-center gap-3">
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm text-orange-800 flex-1">Waiting for seller to accept your order</p>
                                            </div>
                                        )}

                                        {order.status === 'accepted' && (
                                            <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center gap-3">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <p className="text-sm text-purple-800 flex-1">Order accepted! Seller is preparing your package</p>
                                            </div>
                                        )}

                                        {order.status === 'shipped' && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                </svg>
                                                <div className="flex-1">
                                                    <p className="text-sm text-blue-800">Expected by <span className="font-medium">{formatDate(order.expectedDate)}</span></p>
                                                    <p className="text-xs text-blue-600 mt-0.5">Tracking ID: {order.trackingId}</p>
                                                </div>
                                                <button className="text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer">
                                                    Track Order
                                                </button>
                                            </div>
                                        )}

                                        {order.status === 'delivered' && (
                                            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-3">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm text-green-800 flex-1">Delivered on <span className="font-medium">{formatDate(order.deliveredDate)}</span></p>
                                                <button className="text-xs font-medium text-green-700 hover:text-green-900 cursor-pointer">
                                                    Write Review
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex items-center justify-between p-4 border-t border-border bg-background">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-text-secondary">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                                            <span className="text-text-muted">•</span>
                                            <span className="text-sm font-bold text-text-primary">Total: ₹{order.total}</span>
                                        </div>
                                        <Link to={`/buyer/orders/${order.id}`} className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-1">No orders found</h3>
                                <p className="text-sm text-text-secondary mb-4">
                                    {activeTab === 'all' ? "You haven't placed any orders yet" : `No ${activeTab} orders`}
                                </p>
                                <Link
                                    to="/buyer/home"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    Start Shopping
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-border py-4 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
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

export default MyOrders;
