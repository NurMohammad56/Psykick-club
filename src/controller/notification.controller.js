import { Notification } from "../model/notification.model.js";

export const createNotification = async (req, res, next) => {
    const { userId } = req.params;
    const { message } = req.body;

    try {
        let notification

        if (userId) {
            notification = await Notification.create({ userId, message });
        }

        else {
            notification = await Notification.create({ message });
        }

        return res.status(201).json({
            status: true,
            message: "Notification created successfully",
            data: notification
        });
    }

    catch (error) {
        next(error);
    }
}

export const getNotifications = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({
            $or: [
                { userId },  
                { userId: null }     
            ]
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            status: true,
            message: "Notifications fetched successfully",
            data: notifications
        });
    }

    catch (error) {
        next(error);
    }
}