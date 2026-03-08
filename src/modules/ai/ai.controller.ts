import { Request, Response } from "express";
import { AIAsk } from "./ai.model";
import { AIService } from "./ai.service";
import { IGeminiRequest } from "./ai.interface";

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

const googleAsk = async (req: Request, res: Response) => {
  try {
    console.log("request data:", req.body);
    const { prompt, mode } = req.body as IGeminiRequest;

    if (!prompt || prompt.trim() === "") {
      res.status(400).json({ error: "prompt is required." });
      return;
    }

    if (!mode || !["parenting", "exam"].includes(mode)) {
      res.status(400).json({ error: "mode must be 'parenting' or 'exam'." });
      return;
    }

    const response = await AIService.googleAsk(prompt.trim(), mode);

    // ✅ response is already a string — no .result needed
    const chatEntry = await AIAsk.create({ prompt, response });

    res.status(200).json({
      message: "AI Response successfully",
      data: chatEntry,
    });
  } catch (error) {
    console.error("googleAsk error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const AIController = {
  aiAsk,
  googleAsk,
};
