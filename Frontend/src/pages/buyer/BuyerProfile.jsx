import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BuyerSidebar from '../../components/buyer/BuyerSidebar';
import BuyerHeader from '../../components/buyer/BuyerHeader';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, authAPI, wishlistAPI, cartAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

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
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: ''
    });

    const [addressForm, setAddressForm] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        state: '',
        city: '',
        pincode: '',
        addressLine: '',
        isDefault: false
    });

    // Fetch profile data on mount and when page regains focus
    useEffect(() => {
        fetchProfileData();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchProfileData();
            }
        };
        const handleFocus = () => fetchProfileData();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
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

            // Fetch everything, wrap in try-catch to avoid one failure breaking others
            const results = await Promise.allSettled([
                orderAPI.getMyOrders(),
                wishlistAPI.getWishlist(),
                cartAPI.getCart()
            ]);

            const [ordersRes, wishlistRes, cartRes] = results;

            if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
                setRecentOrders(ordersRes.value.data.orders?.slice(0, 3) || []);
                setStats(prev => ({ ...prev, orders: ordersRes.value.data.orders?.length || 0 }));
            }
            if (wishlistRes.status === 'fulfilled' && wishlistRes.value.data.success) {
                setStats(prev => ({ ...prev, wishlist: wishlistRes.value.data.wishlist?.books?.length || 0 }));
            }
            if (cartRes.status === 'fulfilled' && cartRes.value.data.success) {
                setStats(prev => ({ ...prev, cart: cartRes.value.data.cart?.items?.length || 0 }));
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
                if (updateUser) updateUser(response.data.user);
                setEditMode(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            let response;
            if (editingAddress) {
                response = await authAPI.updateAddress(editingAddress._id, addressForm);
            } else {
                response = await authAPI.addAddress(addressForm);
            }

            if (response.data.success) {
                if (updateUser) updateUser(response.data.user);
                setShowAddressModal(false);
                setEditingAddress(null);
                setAddressForm({
                    label: 'Home', fullName: '', phone: '', state: '', city: '', pincode: '', addressLine: '', isDefault: false
                });
                toast.success(editingAddress ? 'Address updated' : 'Address added');
            }
        } catch (error) {
            toast.error('Failed to save address');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const response = await authAPI.deleteAddress(id);
            if (response.data.success) {
                if (updateUser) updateUser(response.data.user);
                toast.success('Address deleted');
            }
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await authAPI.setDefaultAddress(id);
            if (response.data.success) {
                if (updateUser) updateUser(response.data.user);
                toast.success('Default address updated');
            }
        } catch (error) {
            toast.error('Failed to set default');
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

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <BuyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <BuyerHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 overflow-y-auto">
                    <section className="mb-8">
                        <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Account</span>
                        <h1 className="text-2xl md:text-3xl font-light text-text-primary mt-2">
                            My <span className="font-black italic text-primary">Profile</span>
                        </h1>
                    </section>

                    {/* Profile Stats Card */}
                    <section className="mb-8">
                        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-border rounded-xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl md:text-3xl font-bold shrink-0">
                                    {user?.fullname?.split(' ').map(n => n[0]).join('') || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-medium text-text-primary">{user?.fullname || 'User'}</h2>
                                    <p className="text-text-secondary text-sm mt-1">{user?.email || 'No email'}</p>
                                    <p className="text-text-muted text-xs mt-2 italic">
                                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-6 md:gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.orders}</p>
                                        <p className="text-xs text-text-muted uppercase tracking-tighter">Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.wishlist}</p>
                                        <p className="text-xs text-text-muted uppercase tracking-tighter">Wishlist</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.cart}</p>
                                        <p className="text-xs text-text-muted uppercase tracking-tighter">In Cart</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6">
                        <div className="flex gap-1 border-b border-border">
                            {['profile', 'addresses'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-medium capitalize transition-all cursor-pointer ${activeTab === tab
                                        ? 'text-primary border-b-2 border-primary -mb-px'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12">
                        {activeTab === 'profile' && (
                            <div className="grid md:grid-cols-2 gap-6 scale-in-sm">
                                <div className="bg-background-alt border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                                        <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
                                        {!editMode ? (
                                            <button onClick={() => setEditMode(true)} className="text-sm text-primary hover:underline cursor-pointer">Edit</button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button onClick={() => setEditMode(false)} className="text-sm text-text-secondary hover:underline cursor-pointer">Cancel</button>
                                                <button onClick={handleSaveProfile} disabled={saveLoading} className="text-sm text-primary font-bold hover:underline cursor-pointer disabled:opacity-50">
                                                    {saveLoading ? '...' : 'Save'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Full Name</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    value={formData.fullname}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                                                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-all"
                                                />
                                            ) : (
                                                <p className="text-text-primary mt-1 font-medium">{user?.fullname || 'Not set'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Email</label>
                                            <p className="text-text-primary mt-1 font-medium">{user?.email || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Phone</label>
                                            {editMode ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-all"
                                                />
                                            ) : (
                                                <p className="text-text-primary mt-1 font-medium">{user?.phone || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-background-alt border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                                        <h3 className="text-lg font-medium text-text-primary">Recent Orders</h3>
                                        <Link to="/buyer/orders" className="text-sm text-primary hover:underline">View All</Link>
                                    </div>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentOrders.map((order) => (
                                                <div key={order._id} className="group flex items-center justify-between py-3 hover:bg-white/40 rounded-lg px-2 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border overflow-hidden">
                                                            {order.book?.image ? (
                                                                <img src={order.book.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{order.book?.title}</p>
                                                            <p className="text-[10px] text-text-muted uppercase tracking-tight">{formatDate(order.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-text-primary">₹{order.totalAmount}</p>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${getStatusColor(order.status)} font-bold`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-text-muted text-sm">No orders yet</p>
                                            <Link to="/buyer/home" className="text-primary text-sm font-bold hover:underline mt-2 inline-block">Start Exploring</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user?.addresses?.map((addr) => (
                                    <div key={addr._id} className={`bg-background-alt border rounded-2xl p-6 relative transition-all group ${addr.isDefault ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-primary text-white' : 'bg-background text-text-muted group-hover:text-primary'}`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressModal(true); }} className="text-text-muted hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                {!addr.isDefault && (
                                                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-text-muted hover:text-error p-1.5 rounded-lg hover:bg-error/10 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-text-primary text-sm">{addr.label}</h4>
                                                {addr.isDefault && <span className="bg-primary/20 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Default</span>}
                                            </div>
                                            <p className="text-sm font-medium text-text-primary">{addr.fullName}</p>
                                            <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2 italic">
                                                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                            <p className="text-xs text-text-muted mt-2 font-mono">{addr.phone}</p>
                                        </div>
                                        {!addr.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(addr._id)}
                                                className="mt-4 w-full py-2 text-[10px] font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => { setEditingAddress(null); setAddressForm({ label: 'Home', fullName: user?.fullname || '', phone: user?.phone || '', state: '', city: '', pincode: '', addressLine: '', isDefault: false }); setShowAddressModal(true); }}
                                    className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all text-text-secondary hover:text-primary min-h-[220px]"
                                >
                                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Add New Address</span>
                                </button>
                            </div>
                        )}
                    </section>
                </main>

                <footer className="border-t border-border py-8 px-4 md:px-8 mt-auto bg-background-alt/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-medium tracking-tighter text-text-muted uppercase">© 2026 BookMart. Aesthetic Curations.</p>
                        <div className="flex items-center gap-6">
                            {['Help', 'Privacy', 'Terms'].map(link => (
                                <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors">{link}</a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-background border border-border rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden scale-in">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-background-alt/50">
                            <h3 className="text-xl font-light">{editingAddress ? 'Edit' : 'Add'} <span className="font-black italic text-primary">Address</span></h3>
                            <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddressSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Label (e.g. Home, Office)</label>
                                    <input required type="text" value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Receiver Name</label>
                                    <input required type="text" value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
                                    <input required type="tel" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Address Line</label>
                                    <textarea required rows="2" value={addressForm.addressLine} onChange={e => setAddressForm({ ...addressForm, addressLine: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">City</label>
                                    <input required type="text" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">State</label>
                                    <input required type="text" value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Pincode</label>
                                    <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} className="w-full mt-1.5 px-4 py-3 bg-background-alt border border-border rounded-xl focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <div className="flex items-center gap-3 ml-1">
                                    <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary cursor-pointer" />
                                    <label htmlFor="isDefault" className="text-xs font-bold uppercase tracking-tight text-text-secondary cursor-pointer">Set as default</label>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-4 border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-background-alt transition-all">Cancel</button>
                                <button type="submit" disabled={saveLoading} className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-primary/20 disabled:opacity-50">
                                    {saveLoading ? 'Processing...' : (editingAddress ? 'Update Address' : 'Save Address')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerProfile;
