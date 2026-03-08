import { openai, groq } from "./../utils/openai";

export const generateReframeWithAI = async (
  prompt: string,
): Promise<string> => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.4,
    });

    return res.choices[0]?.message?.content?.trim() || "";
  } catch (groqError) {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.4,
    });

    return res.choices[0]?.message?.content?.trim() || "";
  }
};

export const buildReframePrompt = (userPrompt: string) => `
You are a parenting support assistant.

User situation:
"${userPrompt}"

Return a JSON object ONLY in this exact format:
{
  "perspective": { "content": "..." },
  "helps": { "content": "..." },
  "nextSteps": ["...", "...", "..."]
}

Rules:
- Be empathetic and neutral.
- Keep language parent-friendly.
- nextSteps must be 2–4 short actionable steps.
- Do not include markdown.
- Do not include any text outside valid JSON.
`;
