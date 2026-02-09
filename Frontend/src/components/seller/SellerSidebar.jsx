import { Link, useLocation } from 'react-router-dom';

const SellerSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        {
            label: 'Overview',
            items: [
                { name: 'Dashboard', path: '/seller/home', icon: 'home' },
                { name: 'Analytics', path: '/seller/analytics', icon: 'chart' },
            ]
        },
        {
            label: 'Inventory',
            items: [
                { name: 'My Books', path: '/seller/books', icon: 'book' },
                { name: 'Add New Book', path: '/seller/books/new', icon: 'plus' },
            ]
        },
        {
            label: 'Orders',
            items: [
                { name: 'All Orders', path: '/seller/orders', icon: 'package' },
            ]
        },
        {
            label: 'Account',
            items: [
                { name: 'Store Profile', path: '/seller/profile', icon: 'store' },
                { name: 'Settings', path: '/seller/settings', icon: 'settings' },
            ]
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            home: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            ),
            chart: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            ),
            book: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            ),
            plus: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            ),
            package: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            ),
            clock: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            truck: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            ),
            store: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            ),
            settings: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            ),
        };
        return icons[iconName] || icons.home;
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo & Close */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <Link to="/" className="text-xl font-medium text-text-primary tracking-tight">
                            BookMart<span className="text-primary">.</span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Seller Badge */}
                    <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                                BW
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-primary truncate">BookWorm Store</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded">SELLER</span>
                                    <span className="flex items-center text-xs text-text-muted">
                                        <svg className="w-3 h-3 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        4.9
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4">
                        {menuItems.map((section, idx) => (
                            <div key={idx} className="mb-6">
                                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3 px-3">
                                    {section.label}
                                </p>
                                <ul className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = location.pathname === item.path ||
                                            (item.path.includes('?') && location.pathname + location.search === item.path);
                                        return (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    onClick={onClose}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                                                        ? 'bg-primary text-white'
                                                        : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                                        }`}
                                                >
                                                    <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {getIcon(item.icon)}
                                                    </svg>
                                                    <span className="flex-1">{item.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Switch to Buyer */}
                    <div className="p-4 border-t border-border">
                        <Link to="/buyer/home" className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span>Switch to Buyer</span>
                        </Link>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all cursor-pointer mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SellerSidebar;
