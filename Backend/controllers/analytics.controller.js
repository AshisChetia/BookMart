
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";


export const getSellerDashboard = async (req, res) => {
    try {
        
        const sellerId = req.user._id;

        const orderStats = await Order.aggregate([
            
            {
                $match: { seller: sellerId }
            },
           
            {
                $group: {
                    _id: null,  
                    totalOrders: { $sum: 1 },  
                    totalEarnings: {
                        $sum: {
                            
                            $cond: [
                                { $eq: ["$status", "delivered"] },  
                                "$totalAmount",                     
                                0                                  
                            ]
                        }
                    },
                    uniqueCustomers: { $addToSet: "$buyer" }
                }
            }
        ]);

       
        const totalBooks = await Book.countDocuments({ seller: sellerId });

        
        const stats = orderStats[0] || {
            totalOrders: 0,
            totalEarnings: 0,
            uniqueCustomers: []
        };

        return res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            stats: {
                totalOrders: stats.totalOrders,
                totalEarnings: stats.totalEarnings,
                totalBooks: totalBooks,
                totalCustomers: stats.uniqueCustomers.length 
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

        const topBooks = await Order.aggregate([
            
            {
                $match: { seller: sellerId }
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
