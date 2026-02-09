import { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';

// Circular Progress Component - Reusable for different metrics
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = '#234F1E', label, value, subLabel }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background circle */}
                <svg className="transform -rotate-90" width={size} height={size}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E5E2DB"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-text-primary">{value}</span>
                    {subLabel && <span className="text-xs text-text-muted">{subLabel}</span>}
                </div>
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary text-center">{label}</p>
        </div>
    );
};

const SellerAnalytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('month');

    // Analytics data - replace with API data later
    const analyticsData = {
        overview: {
            totalRevenue: 48250,
            totalOrders: 156,
            avgOrderValue: 309,
            conversionRate: 3.2,
        },
        circularMetrics: [
            { label: 'Order Completion', percentage: 94, value: '94%', subLabel: '147/156', color: '#234F1E' },
            { label: 'Customer Satisfaction', percentage: 98, value: '4.9', subLabel: '124 reviews', color: '#2E7D32' },
            { label: 'Return Rate', percentage: 2, value: '2%', subLabel: '3 returns', color: '#C62828' },
            { label: 'Repeat Customers', percentage: 45, value: '45%', subLabel: '70 customers', color: '#1565C0' },
        ],
        monthlyRevenue: [
            { month: 'Sep', value: 32000 },
            { month: 'Oct', value: 38500 },
            { month: 'Nov', value: 42000 },
            { month: 'Dec', value: 55000 },
            { month: 'Jan', value: 48250 },
            { month: 'Feb', value: 52000 },
        ],
        categoryBreakdown: [
            { category: 'Self-Help', sales: 45, percentage: 35, color: '#234F1E' },
            { category: 'Fiction', sales: 38, percentage: 30, color: '#3A7D32' },
            { category: 'Non-Fiction', sales: 28, percentage: 22, color: '#4A7C59' },
            { category: 'Thriller', sales: 17, percentage: 13, color: '#6B9B7A' },
        ],
        topPerformers: [
            { title: 'The Psychology of Money', sales: 45, revenue: 13455 },
            { title: 'Atomic Habits', sales: 38, revenue: 13262 },
            { title: 'Deep Work', sales: 32, revenue: 10400 },
            { title: 'The Alchemist', sales: 24, revenue: 4776 },
            { title: 'Thinking, Fast and Slow', sales: 17, revenue: 6783 },
        ],
    };

    const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map(m => m.value));

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Page Header */}
                    <section className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                                    Store <span className="font-bold text-primary">Analytics</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Track your store's performance and growth.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-background-alt border border-border rounded-lg p-1">
                                {['week', 'month', 'year'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer capitalize ${timeRange === range
                                            ? 'bg-primary text-white'
                                            : 'text-text-secondary hover:text-text-primary'
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Overview Stats */}
                    <section className="mb-6 sm:mb-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Total Revenue</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">₹{analyticsData.overview.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Total Orders</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{analyticsData.overview.totalOrders}</p>
                                <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Avg. Order Value</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">₹{analyticsData.overview.avgOrderValue}</p>
                                <p className="text-xs text-green-600 mt-1">+3.1% from last month</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Conversion Rate</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{analyticsData.overview.conversionRate}%</p>
                                <p className="text-xs text-text-muted mt-1">Industry avg: 2.5%</p>
                            </div>
                        </div>
                    </section>

                    {/* Circular Progress Charts */}
                    <section className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-6 h-px bg-primary" />
                            <h2 className="text-base sm:text-lg font-medium text-text-primary">Performance Metrics</h2>
                        </div>
                        <div className="bg-background-alt border border-border rounded-xl p-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                {analyticsData.circularMetrics.map((metric, idx) => (
                                    <CircularProgress
                                        key={idx}
                                        percentage={metric.percentage}
                                        value={metric.value}
                                        subLabel={metric.subLabel}
                                        label={metric.label}
                                        color={metric.color}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        {/* Revenue Chart */}
                        <section>
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h3 className="font-medium text-text-primary mb-4">Monthly Revenue</h3>
                                <div className="flex items-end justify-between gap-2 h-48">
                                    {analyticsData.monthlyRevenue.map((month, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 relative group"
                                                style={{ height: `${(month.value / maxRevenue) * 100}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    ₹{month.value.toLocaleString()}
                                                </div>
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all"
                                                    style={{ height: idx === analyticsData.monthlyRevenue.length - 2 ? '100%' : '60%' }}
                                                />
                                            </div>
                                            <span className="text-xs text-text-muted">{month.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Category Breakdown */}
                        <section>
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h3 className="font-medium text-text-primary mb-4">Sales by Category</h3>
                                <div className="space-y-4">
                                    {analyticsData.categoryBreakdown.map((cat, idx) => (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-text-primary">{cat.category}</span>
                                                <span className="text-sm font-medium text-text-primary">{cat.sales} sales ({cat.percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-border rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Top Performers Table */}
                    <section className="mb-6">
                        <div className="bg-background-alt border border-border rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-medium text-text-primary">Top Performing Books</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Rank</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Book Title</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Sales</th>
                                            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {analyticsData.topPerformers.map((book, idx) => (
                                            <tr key={idx} className="hover:bg-background transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        idx === 1 ? 'bg-gray-100 text-gray-700' :
                                                            idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-background-alt text-text-muted'
                                                        }`}>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">{book.title}</td>
                                                <td className="px-4 py-3 text-sm text-text-secondary">{book.sales}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-primary">₹{book.revenue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-text-muted">© 2026 BookMart. Seller Dashboard</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Export Report</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SellerAnalytics;
