import { googleai, groq } from "../../utils/openai";
import { IGeminiTopic } from "./ai.interface";

const FALLBACK_MODELS: string[] = [
  "gemini-2.5-flash", // 10 RPM, 250 req/day  ← best free option
  "gemini-2.5-pro", // 5 RPM,  100 req/day
  "gemini-2.0-flash", // limited free tier
];

const getSystemInstruction = (mode: IGeminiTopic): string => {
  switch (mode) {
    case "parenting":
      return "You are a child psychology expert. Give practical advice on managing children who are unmotivated.";
    case "exam":
      return "You are an expert academic coach. Give high-pressure, short-term exam study strategies.";
  }
};

const askGroq = async (
  prompt: string,
  topic: IGeminiTopic,
): Promise<string> => {
  const systemInstructions = getSystemInstruction(topic);

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0]?.message?.content || "";
};

const generateWithFallback = async (
  prompt: string,
  mode: IGeminiTopic,
): Promise<string> => {
  const systemInstruction = getSystemInstruction(mode);
  const fullPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await googleai.models.generateContent({
        model,
        contents: fullPrompt,
      });

      console.log(`Success with model: ${model}`);
      return response.text ?? "";
    } catch (error: any) {
      if (error?.status === 429) {
        console.warn(`Model ${model} quota exceeded, trying next...`);
        continue;
      }
      throw error;
    }
  }

  throw new Error("All models quota exceeded. Please try again later.");
};

const googleAsk = async (
  prompt: string,
  mode: IGeminiTopic,
): Promise<string> => {
  const result = await generateWithFallback(prompt, mode);
  return result;
};

export const AIService = {
  askGroq,
  googleAsk,
};
