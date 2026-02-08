import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Dummy orders data - in real app would fetch by orderId
    const allOrders = {
        'ORD-2026-001': {
            id: 'ORD-2026-001',
            date: '2026-02-06',
            status: 'delivered',
            total: 598,
            subtotal: 748,
            discount: 150,
            items: [
                { id: 1, title: "The Psychology of Money", author: "Morgan Housel", price: 299, originalPrice: 450, image: assets.landing.featured, qty: 1 },
                { id: 2, title: "Atomic Habits", author: "James Clear", price: 299, originalPrice: 499, image: assets.categories.selfHelp, qty: 1 },
            ],
            deliveredDate: '2026-02-08',
            seller: {
                name: 'BookWorm Store',
                email: 'contact@bookworm.com',
                phone: '+91 98765 43210'
            },
            shippingAddress: {
                name: 'John Doe',
                address: '123 Main St, Apt 4B',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                phone: '+91 98765 12345'
            },
            payment: {
                method: 'Cash on Delivery',
                transactionId: null,
                paidAt: null
            }
        },
        'ORD-2026-002': {
            id: 'ORD-2026-002',
            date: '2026-02-05',
            status: 'shipped',
            total: 320,
            subtotal: 450,
            discount: 130,
            items: [
                { id: 3, title: "Where the Crawdads Sing", author: "Delia Owens", price: 320, originalPrice: 450, image: assets.categories.fiction, qty: 1 },
            ],
            trackingId: 'TRK123456789',
            expectedDate: '2026-02-10',
            seller: {
                name: 'Literary Hub',
                email: 'hello@literaryhub.com',
                phone: '+91 87654 32109'
            },
            shippingAddress: {
                name: 'John Doe',
                address: '456 Park Ave, Floor 2',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                phone: '+91 98765 12345'
            },
            payment: {
                method: 'Cash on Delivery',
                transactionId: null,
                paidAt: null
            }
        },
        'ORD-2026-003': {
            id: 'ORD-2026-003',
            date: '2026-02-04',
            status: 'accepted',
            total: 524,
            subtotal: 699,
            discount: 175,
            items: [
                { id: 4, title: "Deep Work", author: "Cal Newport", price: 325, originalPrice: 450, image: assets.categories.selfHelp, qty: 1 },
                { id: 5, title: "The Alchemist", author: "Paulo Coelho", price: 199, originalPrice: 299, image: assets.categories.fiction, qty: 1 },
            ],
            seller: {
                name: 'Focus Books',
                email: 'support@focusbooks.com',
                phone: '+91 76543 21098'
            },
            shippingAddress: {
                name: 'John Doe',
                address: '789 Lake Rd',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001',
                phone: '+91 98765 12345'
            },
            payment: {
                method: 'Cash on Delivery',
                transactionId: null,
                paidAt: null
            }
        },
        'ORD-2026-004': {
            id: 'ORD-2026-004',
            date: '2026-02-03',
            status: 'pending',
            total: 275,
            subtotal: 399,
            discount: 124,
            items: [
                { id: 6, title: "The Silent Patient", author: "Alex Michaelides", price: 275, originalPrice: 399, image: assets.categories.thriller, qty: 1 },
            ],
            seller: {
                name: 'Page Turner',
                email: 'info@pageturner.com',
                phone: '+91 65432 10987'
            },
            shippingAddress: {
                name: 'John Doe',
                address: '321 Hill St',
                city: 'Pune',
                state: 'Maharashtra',
                pincode: '411001',
                phone: '+91 98765 12345'
            },
            payment: {
                method: 'Cash on Delivery',
                transactionId: null,
                paidAt: null
            }
        }
    };

    const order = allOrders[orderId];

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
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Order Timeline Steps
    const getTimelineSteps = () => {
        const steps = [
            { id: 'placed', label: 'Order Placed', date: order.date, completed: true },
            { id: 'accepted', label: 'Accepted', date: order.status !== 'pending' ? order.date : null, completed: ['accepted', 'shipped', 'delivered'].includes(order.status) },
            { id: 'shipped', label: 'Shipped', date: order.status === 'shipped' || order.status === 'delivered' ? order.date : null, completed: ['shipped', 'delivered'].includes(order.status) },
            { id: 'delivered', label: 'Delivered', date: order.deliveredDate || null, completed: order.status === 'delivered' },
        ];
        return steps;
    };

    if (!order) {
        return (
            <div className="min-h-screen bg-background font-sans flex">
                <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen">
                    <BuyerHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-background-alt rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium text-text-primary mb-2">Order Not Found</h2>
                            <p className="text-text-secondary mb-4">We couldn't find the order you're looking for.</p>
                            <Link to="/buyer/orders" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Orders
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans flex">
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen">
                <BuyerHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                        <Link to="/buyer/home" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/buyer/orders" className="hover:text-primary transition-colors">My Orders</Link>
                        <span>/</span>
                        <span className="text-text-primary">{order.id}</span>
                    </div>

                    {/* Page Header */}
                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-light text-text-primary flex items-center gap-3">
                                    <span className="font-black italic text-primary">{order.id}</span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="text-sm text-text-secondary">Placed on {formatDate(order.date)}</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <Link to="/buyer/orders" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Orders
                            </Link>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Items & Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Timeline */}
                            <section className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="text-lg font-medium text-text-primary mb-4">Order Timeline</h2>
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                                    <div
                                        className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
                                        style={{
                                            width: order.status === 'pending' ? '0%' :
                                                order.status === 'accepted' ? '33%' :
                                                    order.status === 'shipped' ? '66%' : '100%'
                                        }}
                                    />

                                    {getTimelineSteps().map((step, idx) => (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-border text-text-muted'}`}>
                                                {step.completed ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs font-medium">{idx + 1}</span>
                                                )}
                                            </div>
                                            <span className={`text-xs mt-2 ${step.completed ? 'text-primary font-medium' : 'text-text-muted'}`}>
                                                {step.label}
                                            </span>
                                            {step.date && (
                                                <span className="text-[10px] text-text-muted">{formatDate(step.date)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Status Message */}
                                {order.status === 'shipped' && (
                                    <div className="mt-6 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-800">Your order is on the way!</p>
                                            <p className="text-xs text-blue-600 mt-0.5">Tracking ID: <span className="font-medium">{order.trackingId}</span></p>
                                            <p className="text-xs text-blue-600">Expected by: <span className="font-medium">{formatDate(order.expectedDate)}</span></p>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'delivered' && (
                                    <div className="mt-6 p-3 bg-green-50 rounded-lg flex items-center gap-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-green-800 flex-1">Delivered on <span className="font-medium">{formatDate(order.deliveredDate)}</span></p>
                                        <button className="text-xs font-medium text-green-700 hover:text-green-900 cursor-pointer">Write Review</button>
                                    </div>
                                )}
                            </section>

                            {/* Order Items */}
                            <section className="bg-background-alt border border-border rounded-xl overflow-hidden">
                                <div className="p-5 border-b border-border">
                                    <h2 className="text-lg font-medium text-text-primary">Order Items</h2>
                                </div>
                                <div className="divide-y divide-border">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="p-5 flex gap-4">
                                            <div className="w-20 h-28 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link to={`/buyer/book/${item.id}`} className="text-base font-medium text-text-primary hover:text-primary transition-colors line-clamp-1">
                                                    {item.title}
                                                </Link>
                                                <p className="text-sm text-text-secondary mt-0.5">{item.author}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                                                    <span className="text-sm text-text-muted line-through">₹{item.originalPrice}</span>
                                                </div>
                                                <p className="text-sm text-text-muted mt-1">Qty: {item.qty}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-text-primary">₹{item.price * item.qty}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Order Summary & Info */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <section className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="text-lg font-medium text-text-primary mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Subtotal ({order.items.length} items)</span>
                                        <span className="text-text-primary">₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Discount</span>
                                        <span className="text-green-600">-₹{order.discount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Delivery</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                    <hr className="border-border" />
                                    <div className="flex justify-between">
                                        <span className="text-base font-medium text-text-primary">Total</span>
                                        <span className="text-xl font-bold text-primary">₹{order.total}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Info */}
                            <section className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="text-lg font-medium text-text-primary mb-4">Payment Info</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Method</span>
                                        <span className="text-text-primary font-medium">{order.payment.method}</span>
                                    </div>
                                    {order.payment.transactionId && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Transaction ID</span>
                                            <span className="text-text-primary font-mono text-xs">{order.payment.transactionId}</span>
                                        </div>
                                    )}
                                    {order.payment.paidAt && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">Paid on</span>
                                            <span className="text-text-primary">{formatDate(order.payment.paidAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="text-lg font-medium text-text-primary mb-4">Shipping Address</h2>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <p className="font-medium text-text-primary">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                    <p className="pt-2">{order.shippingAddress.phone}</p>
                                </div>
                            </section>

                            {/* Seller Info */}
                            <section className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="text-lg font-medium text-text-primary mb-4">Seller Info</h2>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                        {order.seller.name.split(' ').map(w => w[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{order.seller.name}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <p>{order.seller.email}</p>
                                    <p>{order.seller.phone}</p>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="space-y-3">
                                {order.status === 'pending' && (
                                    <button className="w-full py-3 border border-red-500 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

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

export default OrderDetails;
