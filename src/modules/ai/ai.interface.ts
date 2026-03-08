export interface IAIAsk extends Document {
  prompt: string;
  response: string;
  modelUsed: string;
  createdAt: Date;
}

export type IGeminiMode = "text" | "chat" | "stream";

export type IGeminiTopic = "parenting" | "exam";

export interface IGeminiRequest {
  prompt: string;
  mode: IGeminiTopic;
}

export interface IGeminiResponse {
  success: boolean;
  mode?: IGeminiMode;
  result: string;
  timestamp: string;
}
