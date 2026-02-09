import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, authAPI, wishlistAPI, cartAPI } from '../../services/api';

const BuyerProfile = () => {
    const { user, updateUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [recentOrders, setRecentOrders] = useState([]);
    const [stats, setStats] = useState({ orders: 0, wishlist: 0, cart: 0 });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: ''
    });

    // Fetch profile data on mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            // Fetch orders, wishlist, and cart counts in parallel
            const [ordersRes, wishlistRes, cartRes] = await Promise.all([
                orderAPI.getMyOrders(),
                wishlistAPI.getWishlist(),
                cartAPI.getCart()
            ]);

            if (ordersRes.data.success) {
                setRecentOrders(ordersRes.data.orders?.slice(0, 3) || []);
                setStats(prev => ({ ...prev, orders: ordersRes.data.orders?.length || 0 }));
            }
            if (wishlistRes.data.success) {
                setStats(prev => ({ ...prev, wishlist: wishlistRes.data.wishlist.books?.length || 0 }));
            }
            if (cartRes.data.success) {
                setStats(prev => ({ ...prev, cart: cartRes.data.cart.items?.length || 0 }));
            }
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaveLoading(true);
            const response = await authAPI.updateProfile(formData);
            if (response.data.success) {
                // Update user in context
                if (updateUser) {
                    updateUser(response.data.user);
                }
                setEditMode(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-50';
            case 'shipped': return 'text-blue-600 bg-blue-50';
            case 'accepted': return 'text-amber-600 bg-amber-50';
            case 'pending': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-text-secondary bg-background-alt';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getJoinedDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long'
            });
        }
        return 'N/A';
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
                                    {user?.fullname?.split(' ').map(n => n[0]).join('') || 'U'}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-medium text-text-primary">{user?.fullname || 'User'}</h2>
                                    <p className="text-text-secondary text-sm mt-1">{user?.email || 'No email'}</p>
                                    <p className="text-text-muted text-xs mt-2">Member since {getJoinedDate()}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 md:gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.orders}</p>
                                        <p className="text-xs text-text-muted">Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.wishlist}</p>
                                        <p className="text-xs text-text-muted">Wishlist</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.cart}</p>
                                        <p className="text-xs text-text-muted">In Cart</p>
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
                                        {!editMode ? (
                                            <button onClick={() => setEditMode(true)} className="text-sm text-primary hover:underline cursor-pointer">Edit</button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditMode(false)} className="text-sm text-text-secondary hover:underline cursor-pointer">Cancel</button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saveLoading}
                                                    className="text-sm text-primary hover:underline cursor-pointer disabled:opacity-50"
                                                >
                                                    {saveLoading ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Full Name</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    value={formData.fullname}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                                                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                                                />
                                            ) : (
                                                <p className="text-text-primary mt-1">{user?.fullname || 'Not set'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Email</label>
                                            <p className="text-text-primary mt-1">{user?.email || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted uppercase tracking-wide">Phone</label>
                                            {editMode ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            ) : (
                                                <p className="text-text-primary mt-1">{user?.phone || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-background-alt border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-medium text-text-primary">Recent Orders</h3>
                                        <Link to="/buyer/orders" className="text-sm text-primary hover:underline">View All</Link>
                                    </div>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : recentOrders.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentOrders.map((order) => (
                                                <div key={order._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary">
                                                            {order.book?.title || 'Book'}
                                                        </p>
                                                        <p className="text-xs text-text-muted">Qty: {order.quantity} • {formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-text-primary">₹{order.totalAmount}</p>
                                                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-text-muted text-sm">No orders yet</p>
                                            <Link to="/buyer/home" className="text-primary text-sm hover:underline">Start shopping</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Saved Address */}
                                {user?.address ? (
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
                                                    {user.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-background-alt border border-border rounded-xl p-6 text-center">
                                        <p className="text-text-muted">No address saved</p>
                                        <button
                                            onClick={() => {
                                                setActiveTab('profile');
                                                setEditMode(true);
                                            }}
                                            className="mt-2 text-primary text-sm hover:underline cursor-pointer"
                                        >
                                            Add address in profile
                                        </button>
                                    </div>
                                )}

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
