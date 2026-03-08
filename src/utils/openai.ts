import OpenAI from "openai";
import Groq from "groq-sdk";
import { GOOGLE_API_KEY, GROQ_API_KEY, OPENAI_API_KEY } from "../config";
import { GoogleGenAI } from "@google/genai";

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

export const googleai = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
});
