import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const Nodemailer_GMAIL = process.env.Nodemailer_GMAIL;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const Nodemailer_GMAIL_PASSWORD = process.env.Nodemailer_GMAIL_PASSWORD;
export const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER;
export const max_file_size = Number(process.env.max_file_size);
export const NODE_ENV = process.env.NODE_ENV;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const WEB_HOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const CLIENT_URL = process.env.CLIENT_URL;
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
export const SUPPORT_PHONE = process.env.SUPPORT_PHONE;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const HF_TOKEN = process.env.HF_TOKEN;
export const HF_API_KEY_TWO = process.env.HF_API_KEY_TWO;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
