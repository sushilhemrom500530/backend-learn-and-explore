import mongoose, { Schema } from "mongoose";
import { ICommonSettings } from "./common.interface";

const commonSettingsSchema = new Schema<ICommonSettings>(
  {
    title: { type: String },
    content: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const About = mongoose.model<ICommonSettings>(
  "About",
  commonSettingsSchema
);
export const Terms = mongoose.model<ICommonSettings>(
  "Terms",
  commonSettingsSchema
);
export const Privacy = mongoose.model<ICommonSettings>(
  "Privacy",
  commonSettingsSchema
);
