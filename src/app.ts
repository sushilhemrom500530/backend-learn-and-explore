import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();
import router from "./routes";
import { logger, logHttpRequests } from "./logger/logger";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app: Application = express();

// ------------------ Security & Performance ------------------
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Optimized compression
app.use(
  compression({
    //  level: 6, // Balanced compression level
    level: 1, // Prioritize speed over compression ratio
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  }),
);

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 1000, // Increased limit for production performance
    message: "Too many requests from this IP, please try again later",
  }),
);

// ------------------ Parsing & Logging ------------------
app.use(express.json({ limit: "10mb" })); // Explicit limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(logHttpRequests); // High-performance Pino logging

// ------------------ Routes ------------------
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "Rehenrose Backend API",
    environment: process.env.NODE_ENV ?? "development",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    message: "Rehenrose Backend is running successfully",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
    timestamp: Date.now(),
  });
});

// ------------------ 404 & Error Handling ------------------
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Final fallback for unexpected errors
app.use((err: any, _req: Request, _res: Response, next: NextFunction) => {
  logger.error(err, "Unhandled Application Error");
  next(err);
});

export default app;
