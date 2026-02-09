import { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';

const SellerOrders = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock orders data - replace with API
    const orders = [
        { id: 'ORD-2026-156', customer: 'Rahul Sharma', email: 'rahul@example.com', book: 'The Psychology of Money', price: 299, status: 'pending', date: '2026-02-09', address: '123 MG Road, Mumbai' },
        { id: 'ORD-2026-155', customer: 'Priya Patel', email: 'priya@example.com', book: 'Atomic Habits', price: 349, status: 'accepted', date: '2026-02-09', address: '456 Brigade Road, Bangalore' },
        { id: 'ORD-2026-154', customer: 'Amit Kumar', email: 'amit@example.com', book: 'Deep Work', price: 325, status: 'shipped', date: '2026-02-08', address: '789 Anna Nagar, Chennai' },
        { id: 'ORD-2026-153', customer: 'Sneha Gupta', email: 'sneha@example.com', book: 'The Alchemist', price: 199, status: 'delivered', date: '2026-02-07', address: '321 Connaught Place, Delhi' },
        { id: 'ORD-2026-152', customer: 'Vikram Singh', email: 'vikram@example.com', book: 'Thinking, Fast and Slow', price: 399, status: 'delivered', date: '2026-02-06', address: '654 Park Street, Kolkata' },
        { id: 'ORD-2026-151', customer: 'Anita Rao', email: 'anita@example.com', book: 'Rich Dad Poor Dad', price: 275, status: 'cancelled', date: '2026-02-05', address: '987 FC Road, Pune' },
    ];

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
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.book.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-orange-100', text: 'text-orange-700' },
            accepted: { bg: 'bg-purple-100', text: 'text-purple-700' },
            shipped: { bg: 'bg-blue-100', text: 'text-blue-700' },
            delivered: { bg: 'bg-green-100', text: 'text-green-700' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
        };
        return styles[status] || styles.pending;
    };

    const getActionButtons = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 cursor-pointer">Accept</button>
                        <button className="px-3 py-1.5 border border-red-300 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 cursor-pointer">Reject</button>
                    </div>
                );
            case 'accepted':
                return (
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 cursor-pointer">Mark Shipped</button>
                );
            case 'shipped':
                return (
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 cursor-pointer">Mark Delivered</button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Page Header */}
                    <section className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                            Order <span className="font-bold text-primary">Management</span>
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">Track and manage your orders</p>
                    </section>

                    {/* Tabs & Search */}
                    <section className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border'
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-background'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:w-72">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Orders Table */}
                    <section>
                        <div className="bg-background-alt border border-border rounded-xl overflow-hidden">
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Order ID</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Customer</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Book</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Amount</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Date</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredOrders.map((order) => {
                                            const statusStyle = getStatusBadge(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-background transition-colors">
                                                    <td className="px-4 py-4 text-sm font-medium text-primary">{order.id}</td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm text-text-primary">{order.customer}</p>
                                                        <p className="text-xs text-text-muted">{order.email}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-text-primary max-w-[200px] truncate">{order.book}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-text-primary">₹{order.price}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs font-medium rounded-full capitalize`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-text-muted">{order.date}</td>
                                                    <td className="px-4 py-4">{getActionButtons(order.status)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-border">
                                {filteredOrders.map((order) => {
                                    const statusStyle = getStatusBadge(order.status);
                                    return (
                                        <div key={order.id} className="p-4">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{order.id}</p>
                                                    <p className="text-xs text-text-muted">{order.date}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text} text-xs font-medium rounded-full capitalize`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-primary mb-1">{order.book}</p>
                                            <p className="text-xs text-text-secondary mb-2">{order.customer}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-primary">₹{order.price}</span>
                                                {getActionButtons(order.status)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-text-primary mb-1">No orders found</h3>
                                    <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <p className="text-xs text-text-muted text-center">Showing {filteredOrders.length} of {orders.length} orders</p>
                </footer>
            </div>
        </div>
    );
};

export default SellerOrders;
