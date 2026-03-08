import express from "express";
import { auth } from "../../middlewares/auth";
import { NotificationController } from "./notification.controller";

const router = express.Router();

router.get(
  "/all",
  auth("admin", "parent", "teen"),
  NotificationController.getMyNotification,
);

router.get(
  "/count/unread",
  auth("admin", "parent", "teen"),
  NotificationController.getUnreadNotificationCount,
);

export const NotificationRoutes = router;
