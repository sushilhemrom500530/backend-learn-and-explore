import httpStatus from "http-status";
import { Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";
import { CustomRequest } from "./../../utils/customRequest";

const getMyNotification = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { id: userId } = req.user;
    const result = await NotificationService.getAllUserNotification(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    });
  }
);

const getUnreadNotificationCount = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { id: userId } = req.user;
    const result = await NotificationService.getUnreadNotificationCount(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification count retrieved successfully",
      data: result,
    });
  }
);

export const NotificationController = {
  getMyNotification,
  getUnreadNotificationCount,
};
