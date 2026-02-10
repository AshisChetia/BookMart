import Notification from "../models/notification.model.js";

// Get user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 notifications

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Mark Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};

// Mark ALL as read
export const markAllRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notifications"
        });
    }
};

// Internal Helper: Create Notification
export const createNotification = async (recipientId, message, type, relatedId = null, onModel = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            message,
            type,
            relatedId,
            onModel
        });
    } catch (error) {
        console.error("Create Notification Error:", error);
        // Don't throw logic error, just log it so main flow isn't interrupted
    }
};
