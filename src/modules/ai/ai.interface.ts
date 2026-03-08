export interface IAIAsk extends Document {
  prompt: string;
  response: string;
  modelUsed: string;
  createdAt: Date;
}
