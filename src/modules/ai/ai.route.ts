import express from "express";
import { AIController } from "./ai.controller";

const router = express.Router();

router.post("/ask", AIController.aiAsk);

export const AIRoutes = router;
