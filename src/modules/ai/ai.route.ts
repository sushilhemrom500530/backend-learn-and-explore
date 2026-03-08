import express from "express";
import { AIController } from "./ai.controller";

const router = express.Router();

router.post("/ask", AIController.aiAsk);

router.post("/google-ask", AIController.googleAsk);

export const AIRoutes = router;
