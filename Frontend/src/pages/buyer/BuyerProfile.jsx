import { useState } from 'react';
import { Link } from 'react-router-dom';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const BuyerProfile = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Mock user data - replace with actual user data from API/context
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        joinedDate: 'January 2024',
        avatar: null,
        address: {
            street: '123 Book Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
        },
        stats: {
            orders: 12,
            wishlist: 8,
            reviews: 5,
        }
    };

    const recentOrders = [
        { id: 'ORD-001', date: '2026-02-05', items: 2, total: 648, status: 'Delivered' },
        { id: 'ORD-002', date: '2026-01-28', items: 1, total: 299, status: 'Delivered' },
        { id: 'ORD-003', date: '2026-01-15', items: 3, total: 897, status: 'Delivered' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-50';
            case 'Shipped': return 'text-blue-600 bg-blue-50';
            case 'Processing': return 'text-amber-600 bg-amber-50';
            default: return 'text-text-secondary bg-background-alt';
        }
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
                    {/* Page Header */}
                    <section className="mb-8">
                        <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Account</span>
                        <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                            My <span className="font-black italic text-primary">Profile</span>
                        </h1>
                    </section>

                    {/* Profile Card */}
                    <section className="mb-8">
                        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-border rounded-xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                {/* Avatar */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl md:text-3xl font-bold shrink-0">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-medium text-text-primary">{user.name}</h2>
                                    <p className="text-text-secondary text-sm mt-1">{user.email}</p>
                                    <p className="text-text-muted text-xs mt-2">Member since {user.joinedDate}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 md:gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{user.stats.orders}</p>
                                        <p className="text-xs text-text-muted">Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{user.stats.wishlist}</p>
                                        <p className="text-xs text-text-muted">Wishlist</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{user.stats.reviews}</p>
                                        <p className="text-xs text-text-muted">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tabs */}
                    <section className="mb-6">
                        <div className="flex gap-1 border-b border-border">
                            {['profile', 'addresses'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors cursor-pointer ${activeTab === tab
                                        ? 'text-primary border-b-2 border-primary -mb-px'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Tab Content */}
                    <section className="mb-12">
                        {activeTab === 'profile' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-background-alt border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
                                        <button className="text-sm text-primary hover:underline cursor-pointer">Edit</button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Full Name</label>
                                            <p className="text-text-primary mt-1">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Email</label>
                                            <p className="text-text-primary mt-1">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Phone</label>
                                            <p className="text-text-primary mt-1">{user.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-background-alt border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-medium text-text-primary">Recent Orders</h3>
                                        <Link to="/buyer/orders" className="text-sm text-primary hover:underline">View All</Link>
                                    </div>
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{order.id}</p>
                                                    <p className="text-xs text-text-muted">{order.items} items • {order.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-text-primary">₹{order.total}</p>
                                                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Saved Address */}
                                <div className="bg-background-alt border border-border rounded-xl p-6 relative">
                                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Default</span>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-text-primary">Home</h4>
                                            <p className="text-sm text-text-secondary mt-1">
                                                {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                                            </p>
                                            <div className="flex gap-3 mt-4">
                                                <button className="text-sm text-primary hover:underline cursor-pointer">Edit</button>
                                                <button className="text-sm text-error hover:underline cursor-pointer">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Add New Address */}
                                <button className="bg-background-alt border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group min-h-[150px]">
                                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-text-muted group-hover:text-primary transition-colors">Add New Address</span>
                                </button>
                            </div>
                        )}


                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-border py-6 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
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

export default BuyerProfile;
