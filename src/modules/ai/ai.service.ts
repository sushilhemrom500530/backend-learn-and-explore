import { groq } from "../../utils/openai";

const askGroq = async (prompt: string, topic: "parenting" | "exam") => {
  // Define the "Brain" of the agent based on the topic
  const systemInstructions =
    topic === "parenting"
      ? "You are a child psychology expert. Give practical advice on managing children who are unmotivated."
      : "You are an expert academic coach. Give high-pressure, short-term exam study strategies.";

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0]?.message?.content || "";
};
const googleAsk = async (prompt: string, topic: "parenting" | "exam") => {
  // Define the "Brain" of the agent based on the topic
  const systemInstructions =
    topic === "parenting"
      ? "You are a child psychology expert. Give practical advice on managing children who are unmotivated."
      : "You are an expert academic coach. Give high-pressure, short-term exam study strategies.";

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0]?.message?.content || "";
};

export const AIService = {
  askGroq,
  googleAsk,
};
