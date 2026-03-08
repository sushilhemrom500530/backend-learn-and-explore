import { Types } from "mongoose";

type IssueType =
  | "spam"
  | "fraud"
  | "abuse"
  | "inappropriate"
  | "warning"
  | "misinformation"
  | "technical"
  | "privacy"
  | "harassment"
  | "other";

export interface ICreateReportPayload {
  service: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  issueType: IssueType;
  description?: string;
}

export type ICommonSettings = {
  title?: string;
  description: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
} & Document;
