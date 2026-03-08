import mongoose, { Schema } from "mongoose";
import { INotification } from "./notification.interface";

const NotificationSchema: Schema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
