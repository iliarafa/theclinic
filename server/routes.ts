import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getClinicalResponse, type Mode } from "./lib/anthropic";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  mode: z.enum(["ARGUE", "GRANDSTAND"]),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Chat endpoint - returns Claude's response based on mode
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, mode } = chatRequestSchema.parse(req.body);
      
      const response = await getClinicalResponse(message, mode as Mode);
      
      res.json({ response });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid request format" 
        });
      }
      
      // Handle FREE_CLOUD_BUDGET_EXCEEDED specifically
      if (error?.message?.includes("FREE_CLOUD_BUDGET_EXCEEDED")) {
        return res.status(402).json({ 
          error: "Cloud budget exceeded. Please upgrade your plan to continue.",
          type: "BUDGET_EXCEEDED"
        });
      }
      
      console.error("Chat API error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to get response" 
      });
    }
  });

  return httpServer;
}
