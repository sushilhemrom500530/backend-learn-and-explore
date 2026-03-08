import { Request, Response } from "express";
import { AIAsk } from "./ai.model";
import { AIService } from "./ai.service";

const aiAsk = async (req: Request, res: Response) => {
  try {
    const { prompt, mode } = req.body;
    // Get AI response from Groq
    const response = await AIService.askGroq(prompt, mode);

    // Save to Mongoose
    const chatEntry = await AIAsk.create({ prompt, response });

    res.status(200).json(chatEntry);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const AIController = {
  aiAsk,
};
