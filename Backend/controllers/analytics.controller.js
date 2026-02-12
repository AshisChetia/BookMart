
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";


export const getSellerDashboard = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // 1. Basic Stats (Orders, Earnings, Customers, Books Sold)
        const orderStats = await Order.aggregate([
            { $match: { seller: sellerId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalEarnings: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "delivered"] }, "$totalAmount", 0]
                        }
                    },
                    totalBooksSold: {
                        $sum: {
                            $cond: [{ $ne: ["$status", "cancelled"] }, "$quantity", 0]
                        }
                    },
                    uniqueCustomers: { $addToSet: "$buyer" },
                    customerOrders: { $push: "$buyer" } // Keep all buyer IDs to check repeats
                }
            }
        ]);

        const totalBooks = await Book.countDocuments({ seller: sellerId });
        const stats = orderStats[0] || { totalOrders: 0, totalEarnings: 0, totalBooksSold: 0, uniqueCustomers: [], customerOrders: [] };

        // Calculate Repeat Customers
        const customerCounts = stats.customerOrders.reduce((acc, buyerId) => {
            acc[buyerId] = (acc[buyerId] || 0) + 1;
            return acc;
        }, {});

        const repeatCustomerCount = Object.values(customerCounts).filter(count => count > 1).length;
        const totalUniqueCustomers = stats.uniqueCustomers.length;
        const repeatRate = totalUniqueCustomers > 0
            ? Math.round((repeatCustomerCount / totalUniqueCustomers) * 100)
            : 0;


        // 2. Monthly Revenue (Last 6 months)
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    seller: sellerId,
                    status: 'delivered',
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 3. Category Sales
        const categorySales = await Order.aggregate([
            { $match: { seller: sellerId, status: { $ne: 'cancelled' } } },
            { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'book' } },
            { $unwind: '$book' },
            {
                $group: {
                    _id: '$book.category',
                    sales: { $sum: '$quantity' },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { sales: -1 } }
        ]);

        // 4. Order Status Stats
        const statusStats = await Order.aggregate([
            { $match: { seller: sellerId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            stats: {
                totalOrders: stats.totalOrders,
                totalEarnings: stats.totalEarnings,
                totalBooks: totalBooks,
                totalBooksSold: stats.totalBooksSold,
                totalCustomers: stats.uniqueCustomers.length,
                repeatCustomerRate: repeatRate,
                repeatCustomerCount: repeatCustomerCount,
                monthlyRevenue: monthlyRevenue.map(item => ({
                    label: new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' }),
                    value: item.revenue
                })),
                categorySales: categorySales.map(item => ({
                    category: item._id,
                    sales: item.sales,
                    revenue: item.revenue
                })),
                orderStatusStats: statusStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};



export const getTopSellingBooks = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { range = 'week' } = req.query;

        let startDate = new Date();
        if (range === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === 'month') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (range === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const topBooks = await Order.aggregate([
            {
                $match: {
                    seller: sellerId,
                    createdAt: { $gte: startDate }
                }
            },

            {
                $group: {
                    _id: "$book",
                    totalQuantitySold: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },

            {
                $sort: { totalQuantitySold: -1 }
            },

            {
                $limit: 5
            },

            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },

            {
                $unwind: "$bookDetails"
            },

            {
                $project: {
                    _id: 0,
                    bookId: "$_id",
                    title: "$bookDetails.title",
                    author: "$bookDetails.author",
                    image: "$bookDetails.image",
                    price: "$bookDetails.price",
                    totalQuantitySold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Top selling books fetched successfully",
            topBooks
        });

    } catch (error) {
        console.error("Top Books Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top selling books"
        });
    }
};



export const getSuggestedBooks = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const sellerCategories = await Book.distinct("category", {
            seller: sellerId
        });

        if (sellerCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No suggestions available yet. Add some books first!",
                suggestedBooks: []
            });
        }


        const suggestedBooks = await Book.find({
            category: { $in: sellerCategories },
            seller: { $ne: sellerId }
        })
            .populate("seller", "fullname")
            .limit(10)
            .select("title author price image category");

        return res.status(200).json({
            success: true,
            message: "Suggested books fetched successfully",
            suggestedBooks,
            basedOnCategories: sellerCategories
        });

    } catch (error) {
        console.error("Suggestions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch suggested books"
        });
    }
};



export const getRecentOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const recentOrders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
                path: "buyer",
                select: "fullname email"
            })
            .populate({
                path: "book",
                select: "title price image"
            });

        return res.status(200).json({
            success: true,
            message: "Recent orders fetched successfully",
            recentOrders
        });

    } catch (error) {
        console.error("Recent Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders"
        });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        // Get all distinct categories with book counts
        const categoryStats = await Book.aggregate([
            {
                $group: {
                    _id: { $toLower: "$category" }, // Normalize case
                    count: { $sum: 1 },
                    originalName: { $first: "$category" } // Keep one original casing for display
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$originalName",
                    value: "$_id",
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            categories: categoryStats
        });
    } catch (error) {
        console.error("Category Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category statistics"
        });
    }
};

export const getSmartSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        let suggestions = [];
        let reason = "Top Selling";

        // 1. Check user Order History
        const userOrders = await Order.find({ buyer: userId }).populate('book');

        if (userOrders.length > 0) {
            // Get categories from bought books
            const boughtCategories = [...new Set(userOrders.map(order => order.book?.category).filter(Boolean))];
            const boughtBookIds = userOrders.map(order => order.book?._id);

            if (boughtCategories.length > 0) {
                // Find books in these categories, excluding bought ones
                suggestions = await Book.find({
                    category: { $in: boughtCategories },
                    _id: { $nin: boughtBookIds }
                })
                    .limit(4)
                    .select("title author price image category seller rating");

                if (suggestions.length > 0) {
                    reason = `Because you like ${boughtCategories[0]}`;
                }
            }
        }

        // 2. Fallback: Top Selling Global (if < 4 suggestions)
        if (suggestions.length < 4) {
            const excludeIds = [...suggestions.map(s => s._id), ...(userOrders?.map(o => o.book?._id) || [])];

            const topSelling = await Order.aggregate([
                {
                    $group: {
                        _id: "$book",
                        totalSold: { $sum: "$quantity" }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 10 }, // Get top 10 candidates
                {
                    $lookup: {
                        from: "books",
                        localField: "_id",
                        foreignField: "_id",
                        as: "bookDetails"
                    }
                },
                { $unwind: "$bookDetails" },
                {
                    $project: {
                        _id: "$bookDetails._id",
                        title: "$bookDetails.title",
                        author: "$bookDetails.author",
                        price: "$bookDetails.price",
                        image: "$bookDetails.image",
                        category: "$bookDetails.category",
                        seller: "$bookDetails.seller",
                    }
                },
                { $match: { _id: { $nin: excludeIds } } },
                { $limit: 4 - suggestions.length }
            ]);

            suggestions = [...suggestions, ...topSelling];
            if (suggestions.length === topSelling.length) reason = "Trending Now"; // If all were top selling
        }

        // 3. Last Resort: Random books (if still < 4)
        if (suggestions.length < 4) {
            const excludeIds = suggestions.map(s => s._id);
            const randomBooks = await Book.find({ _id: { $nin: excludeIds } })
                .limit(4 - suggestions.length)
                .select("title author price image category seller");

            suggestions = [...suggestions, ...randomBooks];
        }

        return res.status(200).json({
            success: true,
            suggestions,
            reason
        });

    } catch (error) {
        console.error("Smart Suggestions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch suggestions"
        });
    }
};
