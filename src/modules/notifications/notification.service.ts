/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from "./notification.model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { IPopulatedUser } from "./notification.interface";

dayjs.extend(utc);
dayjs.extend(timezone);

const getAllUserNotification = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  await Notification.updateMany(
    {
      receiver_ids: userId,
      is_read: false,
    },
    {
      $set: { is_read: true },
    }
  );

  const totalResult = await Notification.countDocuments({
    receiver_ids: userId,
  });

  const notifications = await Notification.find({
    receiver_ids: userId,
  })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name email profile_url")
    .populate("receiver_ids", "name email profile_url")
    .lean();

  const results = notifications.map((notif) => {
    const sender = notif.sender as unknown as IPopulatedUser | null;

    return {
      id: notif._id,
      title: notif.title,
      description: notif.description,
      created_at: notif.created_at,
      is_read: notif.is_read,
      published: dayjs(notif.created_at).fromNow(),
      sender: sender
        ? {
            id: sender._id,
            name: sender.name ?? "System",
            profile_url: sender.profile_url ?? "",
          }
        : null,
    };
  });

  return {
    pagination: {
      total_result: totalResult,
      current_page: page,
      limit,
      total_page: Math.ceil(totalResult / limit),
    },
    results,
  };
};

const getUnreadNotificationCount = async (user_id: string) => {
  const count = await Notification.countDocuments({
    receiver_ids: user_id,
    is_read: false,
  }); 
  return count;
};

export const NotificationService = {
  getAllUserNotification,
  getUnreadNotificationCount,
};
