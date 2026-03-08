import { Document, Types } from "mongoose";

export type INotification = {
  sender: Types.ObjectId;
  receiver_ids?: Types.ObjectId[];
  title: string;
  description: string;
  is_read: boolean | false;
  created_at?: Date;
  updated_at?: Date;
} & Document;

export interface IPopulatedUser {
  _id: string;
  name?: string;
  email?: string;
  profile_url?: string;
}
