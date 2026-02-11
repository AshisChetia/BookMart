import { useState, useEffect } from 'react';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

import OrderInvoice from '../../components/seller/OrderInvoice';

const SellerOrders = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getSellerOrders();
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Don't show error toast if it's just 404/no orders (now handled by backend returning [] but good constraint)
            if (error.response?.status !== 404) {
                toast.error('Failed to load orders');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await orderAPI.updateOrderStatus(orderId, newStatus);
            if (response.data.success) {
                toast.success(`Order ${newStatus} successfully`);
                // Update local state instead of refetching for better UX
                setOrders(prevOrders => prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleViewInvoice = (order) => {
        setSelectedOrder(order);
        setShowInvoice(true);
    };

    const tabs = [
        { id: 'all', label: 'All Orders', count: orders.length },
        { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
        { id: 'accepted', label: 'Accepted', count: orders.filter(o => o.status === 'accepted').length },
        { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
        { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
        { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
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

    const getActionButtons = (order) => {
        switch (order.status) {
            case 'pending':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusUpdate(order._id, 'accepted')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                        >
                            Reject
                        </button>
                    </div>
                );
            case 'accepted':
                return (
                    <button
                        onClick={() => handleStatusUpdate(order._id, 'shipped')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                    >
                        Mark Shipped
                    </button>
                );
            case 'shipped':
                return (
                    <button
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"
                    >
                        Mark Delivered
                    </button>
                );
            default:
                return null;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        // Search functionality - handle potential undefined/null values
        const customerName = order.buyer?.fullname || '';
        const orderId = order._id || '';
        const bookTitle = order.book?.title || '';
        const matchesSearch =
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookTitle.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

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
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                            Order <span className="font-bold text-primary">Management</span>
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">Track and manage your customer orders</p>
                    </div>

                    {/* Tabs & Search */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                        {/* Tabs */}
                        <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-border text-text-secondary'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-64">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div key={order._id} className="bg-background-alt border border-border rounded-lg p-4 sm:p-6 transition-shadow hover:shadow-md">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-sm font-bold text-text-primary uppercase">#{order._id.slice(-6)}</span>
                                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="lg:hidden">
                                                    <span className="text-lg font-bold text-primary">₹{order.totalAmount}</span>
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Customer Details</h3>
                                                    <p className="text-sm font-medium text-text-primary">{order.buyer?.fullname || 'Unknown Customer'}</p>
                                                    <p className="text-sm text-text-secondary">{order.buyer?.email}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Shipping Address</h3>
                                                    <p className="text-sm text-text-secondary">{order.shippingAddress || 'No address provided'}</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-border">
                                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Order Items</h3>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-16 bg-background rounded overflow-hidden flex-shrink-0 border border-border">
                                                        <img
                                                            src={order.book?.image}
                                                            alt={order.book?.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => e.target.src = assets.landing.featured}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary line-clamp-1">{order.book?.title || 'Unknown Book'}</p>
                                                        <p className="text-xs text-text-muted">{order.book?.author || 'Unknown Author'}</p>
                                                        <p className="text-xs text-text-secondary mt-1">Qty: {order.quantity || 1}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6 bg-gray-50/50 lg:bg-transparent -mx-4 -mb-4 lg:mx-0 lg:mb-0 p-4 lg:p-0 mt-4 lg:mt-0 rounded-b-lg lg:rounded-none">
                                            <div className="text-right hidden lg:block">
                                                <p className="text-xs text-text-muted mb-1">Total Amount</p>
                                                <p className="text-xl font-bold text-primary">₹{order.totalAmount}</p>
                                            </div>

                                            <div className="mt-4 lg:mt-0 flex lg:flex-col gap-2 justify-end lg:justify-end">
                                                {getActionButtons(order)}
                                                <button
                                                    onClick={() => handleViewInvoice(order)}
                                                    className="px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded text-sm transition-colors bg-white"
                                                >
                                                    View Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-background-alt border border-border rounded-lg">
                                <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">No orders found</h3>
                                <p className="text-text-secondary">No orders match the selected filter.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Invoice Modal */}
            {showInvoice && selectedOrder && (
                <OrderInvoice order={selectedOrder} onClose={() => setShowInvoice(false)} />
            )}
        </div>
    );
};

export default SellerOrders;
