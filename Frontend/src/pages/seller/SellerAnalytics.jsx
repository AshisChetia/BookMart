import { useState, useEffect } from 'react';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = '#234F1E', label, value, subLabel }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E2DB" strokeWidth={strokeWidth} fill="none" />
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
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            totalBooksSold: 0,
        },
        circularMetrics: [],
        monthlyRevenue: [],
        categoryBreakdown: [],
        topPerformers: [],
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [dashboardRes, topBooksRes] = await Promise.all([
                    analyticsAPI.getSellerDashboard(timeRange), // Pass timeRange
                    analyticsAPI.getTopSellingBooks(timeRange)
                ]);

                if (dashboardRes.data.success) {
                    const stats = dashboardRes.data.stats;
                    const orderStats = stats.orderStatusStats || {};
                    const totalOrders = stats.totalOrders || 1; // Prevent division by zero

                    // Calculate metrics
                    const completedOrders = (orderStats.delivered || 0); // Only delivered counts as completed
                    const completionRate = Math.round((completedOrders / totalOrders) * 100);

                    const cancelledOrders = orderStats.cancelled || 0;
                    const returnRate = Math.round((cancelledOrders / totalOrders) * 100);

                    const avgOrderValue = stats.totalOrders > 0
                        ? Math.round(stats.totalEarnings / stats.totalOrders)
                        : 0;

                    setAnalyticsData({
                        overview: {
                            totalRevenue: stats.totalEarnings,
                            totalOrders: stats.totalOrders,
                            avgOrderValue: avgOrderValue,
                            totalBooksSold: stats.totalBooksSold || 0,
                        },
                        circularMetrics: [
                            { label: 'Order Completion', percentage: completionRate, value: `${completionRate}%`, subLabel: `${completedOrders}/${stats.totalOrders}`, color: '#234F1E' },
                            // Removed Customer Satisfaction 
                            { label: 'Cancellation Rate', percentage: returnRate, value: `${returnRate}%`, subLabel: `${cancelledOrders} cancelled`, color: '#C62828' },
                            { label: 'Repeat Customers', percentage: stats.repeatCustomerRate || 0, value: `${stats.repeatCustomerRate || 0}%`, subLabel: `${stats.repeatCustomerCount || 0} returning`, color: '#1565C0' },
                        ],
                        monthlyRevenue: stats.monthlyRevenue || [],
                        categoryBreakdown: stats.categorySales?.map((cat, index) => ({
                            category: cat.category,
                            sales: cat.sales,
                            percentage: Math.round((cat.sales / (stats.totalBooksSold || 1)) * 100), // Pct of total books sold
                            color: ['#234F1E', '#3A7D32', '#4A7C59', '#6B9B7A'][index % 4]
                        })) || [],
                        topPerformers: topBooksRes.data.topBooks || []
                    });
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]); // Re-run when timeRange changes

    const maxRevenue = analyticsData.monthlyRevenue.length > 0
        ? Math.max(...analyticsData.monthlyRevenue.map(m => m.value)) * 1.2
        : 1000;

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
                    {/* Page Header */}
                    <section className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                                    Store <span className="font-bold text-primary">Analytics</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Track your store's performance and growth.</p>
                            </div>
                            {/* Time range selector - Visual only for now as API returns fixed range */}
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
                                <p className="text-xs text-text-muted mt-1 capitalize">{timeRange} to date</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Total Orders</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{analyticsData.overview.totalOrders}</p>
                                <p className="text-xs text-text-muted mt-1">Avg. value: ₹{analyticsData.overview.avgOrderValue}</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Books Sold</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{analyticsData.overview.totalBooksSold}</p>
                                <p className="text-xs text-text-muted mt-1">Total units</p>
                            </div>
                            <div className="bg-background-alt border border-border rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-text-secondary">Est. Earnings</p>
                                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">₹{(analyticsData.overview.totalRevenue * 0.9).toLocaleString()}</p>
                                <p className="text-xs text-text-muted mt-1">After fees</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
                            <div className="bg-background-alt border border-border rounded-xl p-5 h-full">
                                <h3 className="font-medium text-text-primary mb-6">Revenue Overview</h3>

                                <div className="h-64 flex gap-4">
                                    {/* Y-Axis Labels */}
                                    <div className="flex flex-col justify-between text-xs text-text-muted text-right py-6 w-8 shrink-0">
                                        <span>₹{Math.round(maxRevenue).toLocaleString()}</span>
                                        <span>₹{Math.round(maxRevenue * 0.75).toLocaleString()}</span>
                                        <span>₹{Math.round(maxRevenue * 0.5).toLocaleString()}</span>
                                        <span>₹{Math.round(maxRevenue * 0.25).toLocaleString()}</span>
                                        <span>₹0</span>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="flex-1 relative">
                                        {/* Horizontal Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none z-0">
                                            <div className="border-b border-border/50 border-dashed w-full h-0"></div>
                                            <div className="border-b border-border/50 border-dashed w-full h-0"></div>
                                            <div className="border-b border-border/50 border-dashed w-full h-0"></div>
                                            <div className="border-b border-border/50 border-dashed w-full h-0"></div>
                                            <div className="border-b border-border w-full h-0"></div>
                                        </div>

                                        {/* Bars Grid */}
                                        <div className="absolute inset-0 grid grid-cols-6 items-end pb-6 pt-6 z-10 pl-2">
                                            {(() => {
                                                // Generate last 6 months
                                                const last6Months = Array.from({ length: 6 }, (_, i) => {
                                                    const d = new Date();
                                                    d.setMonth(d.getMonth() - (5 - i));
                                                    return {
                                                        label: d.toLocaleString('default', { month: 'short' }),
                                                        value: 0
                                                    };
                                                });

                                                // Merge actual data
                                                const filledData = last6Months.map(m => {
                                                    const found = analyticsData.monthlyRevenue.find(d => d.label === m.label);
                                                    return found || m;
                                                });

                                                return filledData.map((data, idx) => (
                                                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group relative">
                                                        {/* Tooltip */}
                                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                                            ₹{data.value.toLocaleString()}
                                                        </div>

                                                        {/* Bar */}
                                                        <div className="w-full flex justify-center items-end flex-1">
                                                            <div
                                                                className="w-8 sm:w-10 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all duration-500 relative overflow-hidden"
                                                                style={{ height: `${data.value > 0 ? (data.value / maxRevenue) * 100 : 4}%`, minHeight: '4px' }}
                                                            >
                                                                <div
                                                                    className="absolute bottom-0 left-0 right-0 bg-primary/90 transition-all duration-700 delay-100"
                                                                    style={{ height: data.value > 0 ? '100%' : '0%' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Label */}
                                                        <span className="text-xs text-text-muted font-medium">{data.label}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Category Breakdown */}
                        <section>
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h3 className="font-medium text-text-primary mb-4">Sales by Category</h3>
                                <div className="space-y-4">
                                    {analyticsData.categoryBreakdown.length > 0 ? (
                                        analyticsData.categoryBreakdown.map((cat, idx) => (
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
                                        ))
                                    ) : (
                                        <div className="text-center text-text-muted text-sm py-8">No category sales data</div>
                                    )}
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
                                        {analyticsData.topPerformers.length > 0 ? (
                                            analyticsData.topPerformers.map((book, idx) => (
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
                                                    <td className="px-4 py-3 text-sm text-text-secondary">{book.totalQuantitySold}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-primary">₹{book.totalRevenue.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-text-muted text-sm">No sales data available</td>
                                            </tr>
                                        )}
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
