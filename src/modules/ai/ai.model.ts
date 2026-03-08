import { Schema, model } from "mongoose";
import { IAIAsk } from "./ai.interface";

const ChatSchema = new Schema<IAIAsk>(
  {
    prompt: String,
    response: String,
    modelUsed: String,
  },
  {
    timestamps: true,
  },
);

export const AIAsk = model<IAIAsk>("ask", ChatSchema);
