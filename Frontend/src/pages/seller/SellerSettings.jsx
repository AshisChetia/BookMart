import { useState } from 'react';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';

const SellerSettings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [settings, setSettings] = useState({
        notifications: {
            newOrder: true,
            orderUpdates: true,
            lowStock: true,
            reviews: true,
            promotions: false,
            newsletter: false,
        },
        orderSettings: {
            autoAccept: false,
            defaultShipping: 'standard',
            returnPolicy: '7',
        },
        privacy: {
            showPhone: true,
            showEmail: false,
            publicProfile: true,
        }
    });

    const handleNotificationChange = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
        }));
    };

    const handlePrivacyChange = (key) => {
        setSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: !prev.privacy[key] }
        }));
    };

    const handleSave = () => {
        // TODO: Save to API
        alert('Settings saved successfully!');
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
                            Store <span className="font-bold text-primary">Settings</span>
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">Manage your preferences and configurations</p>
                    </section>

                    <div className="max-w-3xl space-y-6">
                        {/* Notifications */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h2 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Notifications
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { key: 'newOrder', label: 'New Orders', description: 'Get notified when you receive a new order' },
                                    { key: 'orderUpdates', label: 'Order Updates', description: 'Notifications for order status changes' },
                                    { key: 'lowStock', label: 'Low Stock Alerts', description: 'Alert when book stock falls below 5' },
                                    { key: 'reviews', label: 'New Reviews', description: 'Get notified when customers leave reviews' },
                                    { key: 'promotions', label: 'Promotional Tips', description: 'Tips for improving your sales' },
                                    { key: 'newsletter', label: 'Newsletter', description: 'BookMart updates and features' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                            <p className="text-xs text-text-muted">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange(item.key)}
                                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.notifications[item.key] ? 'bg-primary' : 'bg-border'
                                                }`}
                                        >
                                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${settings.notifications[item.key] ? 'translate-x-5' : ''
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Order Settings */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h2 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Order Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Auto-Accept Orders</p>
                                        <p className="text-xs text-text-muted">Automatically accept incoming orders</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings(p => ({ ...p, orderSettings: { ...p.orderSettings, autoAccept: !p.orderSettings.autoAccept } }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.orderSettings.autoAccept ? 'bg-primary' : 'bg-border'
                                            }`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${settings.orderSettings.autoAccept ? 'translate-x-5' : ''
                                            }`} />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Default Shipping Method</label>
                                    <select
                                        value={settings.orderSettings.defaultShipping}
                                        onChange={(e) => setSettings(p => ({ ...p, orderSettings: { ...p.orderSettings, defaultShipping: e.target.value } }))}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value="standard">Standard (5-7 days)</option>
                                        <option value="express">Express (2-3 days)</option>
                                        <option value="overnight">Overnight (1 day)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Return Policy Duration</label>
                                    <select
                                        value={settings.orderSettings.returnPolicy}
                                        onChange={(e) => setSettings(p => ({ ...p, orderSettings: { ...p.orderSettings, returnPolicy: e.target.value } }))}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value="7">7 days</option>
                                        <option value="14">14 days</option>
                                        <option value="30">30 days</option>
                                        <option value="0">No returns</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Privacy */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h2 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Privacy & Visibility
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { key: 'showPhone', label: 'Show Phone Number', description: 'Display phone on your public profile' },
                                    { key: 'showEmail', label: 'Show Email', description: 'Display email on your public profile' },
                                    { key: 'publicProfile', label: 'Public Profile', description: 'Allow customers to view your seller profile' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                            <p className="text-xs text-text-muted">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handlePrivacyChange(item.key)}
                                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.privacy[item.key] ? 'bg-primary' : 'bg-border'
                                                }`}
                                        >
                                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${settings.privacy[item.key] ? 'translate-x-5' : ''
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <section className="bg-red-50 border border-red-200 rounded-xl p-5">
                            <h2 className="font-medium text-red-700 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Danger Zone
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Deactivate Store</p>
                                        <p className="text-xs text-red-600/70">Temporarily hide your store from buyers</p>
                                    </div>
                                    <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                                        Deactivate
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-red-200">
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Delete Store</p>
                                        <p className="text-xs text-red-600/70">Permanently remove your store and all data</p>
                                    </div>
                                    <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                Save All Changes
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <p className="text-xs text-text-muted text-center">© 2026 BookMart. Seller Dashboard</p>
                </footer>
            </div>
        </div>
    );
};

export default SellerSettings;
